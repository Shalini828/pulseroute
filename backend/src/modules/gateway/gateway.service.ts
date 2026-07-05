import { GatewayRequest, GatewayResponse } from "./gateway.types";
import { ProviderFactory } from "./providers/provider.factory";

/**
 * Handles all business logic for the API Gateway.
 *
 * Controllers should never contain business logic.
 * Their responsibility is only to receive requests
 * and return responses.
 */
export class GatewayService {
  /**
   * Factory used to resolve the appropriate provider implementation.
   */
  private readonly providerFactory = new ProviderFactory();

  /**
   * Processes an incoming gateway request and routes it to the selected provider.
   */
  public async processRequest(
    request: GatewayRequest,
  ): Promise<GatewayResponse> {
    const provider = this.providerFactory.getProvider(request.provider);
    const response = await provider.generate({
      prompt: request.prompt,
    });

    return {
      success: true,
      provider: provider.name,
      data: response,
      timestamp: new Date().toISOString(),
    };
  }
}
