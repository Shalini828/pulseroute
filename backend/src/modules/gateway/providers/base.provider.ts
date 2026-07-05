export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Base contract for all AI providers in the gateway.
 */
export abstract class BaseProvider {
  /**
   * Human-readable provider identifier.
   */
  abstract readonly name: string;

  /**
   * Generates a response for the provided prompt.
   */
  abstract generate(request: GenerateRequest): Promise<GenerateResponse>;
}
