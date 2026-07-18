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

export abstract class BaseProvider {

  abstract readonly name: string;
  abstract generate(request: GenerateRequest): Promise<GenerateResponse>;
}
