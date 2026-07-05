import { ProviderFactory } from "./provider.factory";
import { FallbackResult } from "./provider.types";

/**
 * Service to attempt generation across multiple providers in fallback order.
 */
export class FallbackService {
  constructor(private readonly providerFactory: ProviderFactory) {}

  /**
   * Try providers one-by-one until one succeeds.
   */
  public async tryProviders(
    providers: string[],
    prompt: string,
  ): Promise<FallbackResult> {
    for (const providerName of providers) {
      try {
        const provider = this.providerFactory.getProvider(providerName);
        const generated = await provider.generate({ prompt });

        return {
          provider: providerName,
          success: true,
          response: generated.text,
        };
      } catch {
        // Ignore failures and continue to the next provider.
      }
    }

    return {
      provider: "",
      success: false,
      error: "All providers failed.",
    };
  }
}
