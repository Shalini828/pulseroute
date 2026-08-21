import { ProviderFactory } from "./provider.factory";
import type { FallbackResult } from "./provider.types";
import { RetryService } from "../../retry/retry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { HealthMonitorService } from "./health-monitor.service";
import { ChatMessage } from "./base.provider";

export class FallbackService {
  private readonly retryService = new RetryService();
  private readonly circuitBreaker = new CircuitBreakerService();
  private readonly healthMonitor = new HealthMonitorService();

  constructor(private readonly providerFactory: ProviderFactory) {}

  public async tryProviders(
    providers: string[],
    messages: ChatMessage[],
  ): Promise<FallbackResult> {
    if (providers.length === 0) {
      return {
        provider: "",
        success: false,
        error: "No providers available.",
      };
    }

    const attemptedProviders = new Set<string>();
    let lastError = "All providers failed.";

    for (const providerName of providers) {
      const normalizedProvider = providerName.trim().toLowerCase();

      if (attemptedProviders.has(normalizedProvider)) {
        continue;
      }

      attemptedProviders.add(normalizedProvider);

      if (!this.healthMonitor.isHealthy(normalizedProvider)) {
        console.warn(
          `Skipping provider '${normalizedProvider}' because it is unhealthy.`,
        );
        continue;
      }

      if (this.circuitBreaker.isOpen(normalizedProvider)) {
        console.warn(
          `Skipping provider '${normalizedProvider}' because its circuit breaker is open.`,
        );
        continue;
      }

      try {
        const provider =
          this.providerFactory.getProvider(normalizedProvider);

        const generated = await this.retryService.execute(() =>
          provider.generate({
            messages,
          }),
        );

        this.circuitBreaker.recordSuccess(normalizedProvider);
        this.healthMonitor.update(normalizedProvider, true);

        return {
          provider: normalizedProvider,
          success: true,
          text: generated.text,
          usage: generated.usage,
        };
      } catch (error) {
        this.circuitBreaker.recordFailure(normalizedProvider);
        this.healthMonitor.update(normalizedProvider, false);

        lastError =
          error instanceof Error ? error.message : "Unknown error";

        console.error(
          `Provider '${normalizedProvider}' failed: ${lastError}`,
        );
      }
    }

    return {
      provider: "",
      success: false,
      error: lastError,
    };
  }
}