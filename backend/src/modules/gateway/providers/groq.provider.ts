import { BaseProvider, GenerateRequest, GenerateResponse } from './base.provider';

export class GroqProvider extends BaseProvider {

  readonly name = 'groq';

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return {
      text: `Groq mock response for: ${request.prompt}`,
    };
  }
}
