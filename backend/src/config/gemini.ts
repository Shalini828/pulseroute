import { GoogleGenAI } from "@google/genai";
import { env } from "./env";

if (!env.GEMINI_API_KEY) {
}

export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});