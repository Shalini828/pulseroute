import { gemini } from "../../../config/gemini";
import {
  BaseProvider,
  GenerateRequest,
  GenerateResponse,
} from "./base.provider";

export class GeminiProvider extends BaseProvider {
  readonly name = "gemini";

  // async generate(
  //   request: GenerateRequest,
  // ): Promise<GenerateResponse> {
  //   try {
  //     const response = await gemini.models.generateContent({
  //       model: "gemini-2.5-flash",
  //       contents: request.prompt,
  //     });

  //     return {
  //       text: response.text ?? "",
  //     };
  //   } catch (err: unknown) {
  //     const message =
  //       err instanceof Error ? err.message : String(err);

  //     throw new Error(`Gemini API request failed: ${message}`);
  //   }
  // }

  async generate(
  request: GenerateRequest,
): Promise<GenerateResponse> {
  throw new Error("503 Service Unavailable");
}
}