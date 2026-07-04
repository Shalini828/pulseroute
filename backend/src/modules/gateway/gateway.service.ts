import {
  GatewayRequest,
  GatewayResponse,
} from "./gateway.types";

/**
 * Handles all business logic for the API Gateway.
 *
 * Controllers should never contain business logic.
 * Their responsibility is only to receive requests
 * and return responses.
 */
export class GatewayService {
  /**
   * Processes an incoming gateway request.
   * Currently returns a mock response.
   * Later this method will route requests to
   * OpenAI, Gemini, Groq, Anthropic, etc.
   */
  public processRequest(request: GatewayRequest): GatewayResponse {
    const provider = this.normalizeProvider(request.provider);

    return {
      success: true,
      provider,
      data: {
        text: this.buildMockResponse(provider, request.prompt),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Normalizes provider names.
   *
   * Example:
   * OpenAI -> openai
   * OPENAI -> openai
   */
  private normalizeProvider(provider: string): string {
    return provider.trim().toLowerCase();
  }

  /**
   * Generates a mock response.
   *
   * This will later be replaced by actual
   * provider integrations.
   */
  private buildMockResponse(
    provider: string,
    prompt: string
  ): string {
    return `Mock response from ${provider} for prompt: "${prompt}"`;
  }
}