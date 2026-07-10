import { GatewayRequest, GatewayResponse } from "./gateway.types";
import { FallbackGateway } from "./providers/fallback.gateway";
import { ProviderFactory } from "./providers/provider.factory";
import { ProviderHealthService } from "./providers/provider.health";
import { FallbackService } from "./providers/fallback.service";
import { metricsService } from "../metrics/metrics.service";
import { logsService } from "../logs/logs.service";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * Handles all business logic for the API Gateway.
 *
 * Controllers should never contain business logic.
 * Their responsibility is only to receive requests
 * and return responses.
 */
export class GatewayService {
  private readonly providerFactory = new ProviderFactory();
  private readonly providerHealth = new ProviderHealthService();
  private readonly fallbackService = new FallbackService(this.providerFactory);
  private readonly fallbackGateway = new FallbackGateway(
    this.providerHealth,
    this.fallbackService,
  );
  private readonly metricsService = metricsService;
  private readonly logsService = logsService;

  /**
   * Processes an incoming gateway request.
   */
  public async processRequest(
    request: GatewayRequest,
    userId: string,
  ): Promise<GatewayResponse> {
    const start = Date.now();

    try {
      const result = await this.fallbackGateway.generate(
        request.provider,
        request.prompt,
      );

      const responseTime = Date.now() - start;

      this.metricsService.recordSuccess(
        request.provider,
        responseTime,
      );

      console.log(
        "Gateway metrics after update:",
        this.metricsService.getMetrics(),
      );
      
     await this.logsService.addLog(
  "SUCCESS",
  request.provider,
  `Request processed successfully in ${responseTime} ms`,
  responseTime,
);

      await prisma.gatewayRequest.create({
        data: {
          prompt: request.prompt,
          response: result,
          provider: request.provider,
          responseTime,
          userId,
        },
      });

      return {
        success: true,
        provider: request.provider,
        data: {
          text: result,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.metricsService.recordFailure(request.provider);

await this.logsService.addLog(
  "ERROR",
  request.provider,
  "Request failed",
  0,
);

throw error;
    }
  }

  /**
   * Returns all previous requests of the logged-in user.
   */
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