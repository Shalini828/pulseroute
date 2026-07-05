import { BaseProvider } from "./base.provider";
import { OpenAIProvider } from "./openai.provider";
import { GeminiProvider } from "./gemini.provider";
import { GroqProvider } from "./groq.provider";

/**
 * Creates and resolves provider instances for supported AI gateways.
 */
export class ProviderFactory {
  /**
   * Registry of supported providers keyed by provider name.
   */
  private readonly providers = new Map<string, BaseProvider>([
    ["openai", new OpenAIProvider()],
    ["gemini", new GeminiProvider()],
    ["groq", new GroqProvider()],
  ]);

  /**
   * Returns a provider instance for the given name.
   */
  public getProvider(provider: string): BaseProvider {
    const normalizedProvider = provider.trim().toLowerCase();

    const resolvedProvider = this.providers.get(normalizedProvider);

    if (resolvedProvider) {
      return resolvedProvider;
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }
}
