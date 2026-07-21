import { GatewayRequest, GatewayResponse } from "./gateway.types";
import { FallbackGateway } from "./providers/fallback.gateway";
import { ProviderFactory } from "./providers/provider.factory";
import { ProviderHealthService } from "./providers/provider.health";
import { FallbackService } from "./providers/fallback.service";
import { metricsService } from "../metrics/metrics.service";
import { logsService } from "../logs/logs.service";
import { PrismaClient } from "../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { RoutingService } from "../routing/routing.service";
import { cacheService } from "../cache/cache.service";
import { rateLimitService } from "../rate-limit/rate-limit.service";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class GatewayService {
  private readonly providerFactory = new ProviderFactory();
  private readonly providerHealth = new ProviderHealthService();
  private readonly fallbackService = new FallbackService(this.providerFactory);
  private readonly routingService = new RoutingService();
  private readonly fallbackGateway = new FallbackGateway(
    this.providerHealth,
    this.fallbackService,
  );

  private readonly metricsService = metricsService;
  private readonly logsService = logsService;

  public async processRequest(
    request: GatewayRequest,
    projectId: string,
    userId?: string,
  ): Promise<GatewayResponse> {

    const start = Date.now();

    const clientId = userId ?? "anonymous";
    const rateLimit = rateLimitService.check(clientId);

    if (!rateLimit.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`,
      );
    }
    const cacheKey = request.prompt.trim().toLowerCase();

    const cachedResponse = cacheService.get(cacheKey);

    if (cachedResponse) {
      return {
        success: true,
        provider: "cache",
        data: {
          text: cachedResponse,
        },
        timestamp: new Date().toISOString(),
      };
    }
    let selectedProvider = "";

    try {
      // Get providers for the project
      const providers = await this.routingService.selectProvider(projectId);

      const providerNames = providers.map((provider) =>
        provider.name.toLowerCase(),
      );

      // Try providers with fallback
      const result = await this.fallbackService.tryProviders(
        providerNames,
        request.prompt,
      );

      if (!result.success) {
        throw new Error(result.error ?? "All providers failed.");
      }

      selectedProvider = result.provider;
      console.log("About to cache successful response");
      cacheService.set(cacheKey, result.text ?? "");
      const responseTime = Date.now() - start;

      // Metrics
      this.metricsService.recordSuccess(selectedProvider, responseTime);

      // Logs
      await this.logsService.addLog(
        "SUCCESS",
        selectedProvider,
        `Request processed successfully in ${responseTime} ms`,
        responseTime,
      );

      // Save history
      await prisma.gatewayRequest.create({
        data: {
          prompt: request.prompt,
          response: result.text ?? "",
          provider: selectedProvider,
          responseTime,
          projectId,
          userId,
        },
      });

      return {
        success: true,
        provider: selectedProvider,
        data: {
          text: result.text ?? "",
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - start;

      if (selectedProvider) {
        this.metricsService.recordFailure(selectedProvider);
      }

      const message =
        error instanceof Error ? error.message : "Unknown error occurred.";

      await this.logsService.addLog(
        "ERROR",
        selectedProvider || "UNKNOWN",
        message,
        responseTime,
      );

      throw error;
    }
  }

  public async getHistory(userId: string) {
    return prisma.gatewayRequest.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        provider: true,
        prompt: true,
        response: true,
        responseTime: true,
        createdAt: true,
      },
    });
  }
}

export const gatewayService = new GatewayService();
