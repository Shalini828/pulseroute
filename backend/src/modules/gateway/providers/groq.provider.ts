import {
  BaseProvider,
  GenerateRequest,
  GenerateResponse,
} from "./base.provider";

export class GroqProvider extends BaseProvider {
  readonly name = "groq";

  async generate(
    request: GenerateRequest,
  ): Promise<GenerateResponse> {
    const lastMessage =
      request.messages.at(-1)?.content ?? "";

    return {
      text: `Groq mock response for: ${lastMessage}`,
      finishReason: "stop",
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }
}