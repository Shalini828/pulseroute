import { GoogleGenAI } from "@google/genai";
import {
  BaseProvider,
  GenerateRequest,
  GenerateResponse,
  ChatMessage,
} from "./base.provider";

export class GeminiProvider extends BaseProvider {
  readonly name = "gemini";
  readonly metadata = {
    supportsStreaming: true,
    supportsVision: false,
    supportsFunctionCalling: false,
    defaultModel: "gemini-2.5-flash",
  };

  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  private mapMessages(messages: ChatMessage[]) {
    return messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await this.ai.models.generateContent({
      model: request.model ?? "gemini-2.5-flash",
      contents: this.mapMessages(request.messages),
    });

    return {
      text: response.text ?? "",
      finishReason: "stop",
    };
  }

  async generateStream(
    request: GenerateRequest,
    onChunk: (chunk: string) => void,
  ): Promise<GenerateResponse> {
    const response = await this.ai.models.generateContentStream({
      model: request.model ?? "gemini-2.5-flash",
      contents: this.mapMessages(request.messages),
    });

    let fullText = "";

    for await (const chunk of response) {
      const text = chunk.text ?? "";

      if (!text) {
        continue;
      }

      fullText += text;
      onChunk(text);
    }

    return {
      text: fullText,
      finishReason: "stop",
    };
  }
}
