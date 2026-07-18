import { GatewayRequest, GatewayResponse } from "./gateway.types";
import { FallbackGateway } from "./providers/fallback.gateway";
import { ProviderFactory } from "./providers/provider.factory";
import { ProviderHealthService } from "./providers/provider.health";
import { FallbackService } from "./providers/fallback.service";
import { metricsService } from "../metrics/metrics.service";
import { logsService } from "../logs/logs.service";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { RoutingService } from "../routing/routing.service";

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
    userId: string,
  ): Promise<GatewayResponse> {
    const start = Date.now();
    let selectedProvider = "";
    try {
      const providers = await this.routingService.selectProvider(
        request.projectId,
      );
      console.log("Providers selected:", providers);

      const providerNames = providers.map((provider) =>
        provider.name.toLowerCase(),
      );

      const result = await this.fallbackService.tryProviders(
        providerNames,
        request.prompt,
      );
      if (!result.success) {
        throw new Error(result.error ?? "All providers failed.");
      }

      selectedProvider = result.provider;

      const responseTime = Date.now() - start;

      this.metricsService.recordSuccess(result.provider, responseTime);

      console.log(
        "Gateway metrics after update:",
        this.metricsService.getMetrics(),
      );

      await this.logsService.addLog(
        "SUCCESS",
        selectedProvider,
        `Request processed successfully in ${responseTime} ms`,
        responseTime,
      );

      await prisma.gatewayRequest.create({
        data: {
          prompt: request.prompt,
          response: result.response ?? "",
          provider: selectedProvider,
          responseTime,
          userId,
        },
      });

      return {
        success: true,
        provider: selectedProvider,
        data: {
          text: result.response ?? "",
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.metricsService.recordFailure(selectedProvider);

      await this.logsService.addLog(
        "ERROR",
        selectedProvider,
        "Request failed",
        0,
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
