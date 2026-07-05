import { BaseProvider, GenerateRequest, GenerateResponse } from './base.provider';

/**
 * Mock Groq provider implementation for the gateway.
 */
export class GroqProvider extends BaseProvider {
  /**
   * Provider identifier used by the gateway.
   */
  readonly name = 'groq';

  /**
   * Returns a mock generated response without calling the real API.
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return {
      text: `Groq mock response for: ${request.prompt}`,
    };
  }
}
