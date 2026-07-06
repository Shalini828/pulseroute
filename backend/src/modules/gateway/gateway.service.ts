import { GatewayRequest, GatewayResponse } from "./gateway.types";
import { FallbackGateway } from "./providers/fallback.gateway";
import { ProviderFactory } from "./providers/provider.factory";
import { ProviderHealthService } from "./providers/provider.health";
import { FallbackService } from "./providers/fallback.service";
import { metricsService } from "../metrics/metrics.service";
import { logsService } from "../logs/logs.service";

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
   * Processes an incoming gateway request and routes it through the fallback gateway.
   */
  public async processRequest(
    request: GatewayRequest,
  ): Promise<GatewayResponse> {
    const start = Date.now();

    try {
      const result = await this.fallbackGateway.generate(
        request.provider,
        request.prompt,
      );

      const responseTime = Date.now() - start;
      // Record success for the requested provider.
      this.metricsService.recordSuccess(request.provider, responseTime);
      this.logsService.addLog(
        request.provider,
        request.prompt,
        result,
        responseTime,
      );

      return {
        success: true,
        provider: request.provider,
        data: {
          text: result,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Record failure for the requested provider and rethrow.
      this.metricsService.recordFailure(request.provider);
      throw error;
    }
  }
}
