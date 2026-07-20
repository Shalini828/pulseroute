import { BaseProvider, GenerateRequest, GenerateResponse } from './base.provider';

export class OpenAIProvider extends BaseProvider {

  readonly name = 'openai';

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    return {
      text: `OpenAI mock response for: ${request.prompt}`,
    };
  }
}
