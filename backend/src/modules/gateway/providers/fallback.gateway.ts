import { FallbackService } from "./fallback.service";
import { ProviderHealthService } from "./provider.health";
import { ChatMessage } from "./base.provider";

export class FallbackGateway {
  constructor(
    private readonly healthService: ProviderHealthService,
    private readonly fallbackService: FallbackService,
  ) {}

  public async generate(
    provider: string,
    messages: ChatMessage[],
  ): Promise<{
    provider: string;
    text: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  }> {
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
        messages,
      );

      if (result.success && result.provider) {
        this.healthService.markHealthy(result.provider);

        return {
          provider: result.provider,
          text: result.text ?? "",
          usage: result.usage,
        };
      }

      this.healthService.markUnhealthy(providerName);
    }

    throw new Error("No AI provider is currently available.");
  }
}