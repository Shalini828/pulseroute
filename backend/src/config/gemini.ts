import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

if (!env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined.");
}

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});