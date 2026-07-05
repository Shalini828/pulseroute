import { FallbackService } from "./fallback.service";
import { ProviderHealthService } from "./provider.health";

/**
 * Gateway that executes prompt generation using healthy providers and fallback logic.
 */
export class FallbackGateway {
  constructor(
    private readonly healthService: ProviderHealthService,
    private readonly fallbackService: FallbackService,
  ) {}

  /**
   * Generate text by trying the requested provider first, then falling back to healthy providers.
   */
  public async generate(provider: string, prompt: string): Promise<string> {
    const normalizedProvider = provider.trim().toLowerCase();
    const healthyProviders = this.healthService.getHealthyProviders();
    const orderedProviders = [
      normalizedProvider,
      ...healthyProviders
        .map((item) => item.name)
        .filter((name) => name !== normalizedProvider),
    ];

    const triedProviders = new Set<string>();

    for (const providerName of orderedProviders) {
      if (triedProviders.has(providerName)) {
        continue;
      }

      triedProviders.add(providerName);

      const result = await this.fallbackService.tryProviders(
        [providerName],
        prompt,
      );

      if (result.success && result.provider) {
        this.healthService.markHealthy(result.provider);
        return result.response ?? "";
      }

      this.healthService.markUnhealthy(providerName);
    }

    throw new Error("No AI provider is currently available.");
  }
}
