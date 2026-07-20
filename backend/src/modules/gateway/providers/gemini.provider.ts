import { GoogleGenAI } from "@google/genai";
import {
  BaseProvider,
  GenerateRequest,
  GenerateResponse,
} from "./base.provider";

export class GeminiProvider extends BaseProvider {
  readonly name = "gemini";

  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  async generate(
    request: GenerateRequest,
  ): Promise<GenerateResponse> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: request.prompt,
    });

    return {
       text: response.text ?? "",
    };
  }
}