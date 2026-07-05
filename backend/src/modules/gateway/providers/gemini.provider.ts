import { gemini } from "../../../config/gemini";
import {
  BaseProvider,
  GenerateRequest,
  GenerateResponse,
} from "./base.provider";

/**
 * Gemini provider implementation for the gateway.
 */
export class GeminiProvider extends BaseProvider {
  /**
   * Provider identifier used by the gateway.
   */
  readonly name = "gemini";

  /**
   * Generate a response from the Gemini API using the configured client.
   */
  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: request.prompt,
      });

      return {
        text: response.text ?? "",
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Gemini API request failed: ${message}`);
    }
  }
}
