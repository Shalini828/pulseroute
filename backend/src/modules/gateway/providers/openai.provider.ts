import { BaseProvider, GenerateRequest, GenerateResponse } from './base.provider';

/**
 * Mock OpenAI provider implementation for the gateway.
 */
export class OpenAIProvider extends BaseProvider {
  /**
   * Provider identifier used by the gateway.
   */
  readonly name = 'openai';

  /**
   * Returns a mock generated response without calling the real API.
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return {
      text: `OpenAI mock response for: ${request.prompt}`,
    };
  }
}
