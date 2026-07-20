import { ProviderFactory } from "./provider.factory";
import type { FallbackResult } from "./provider.types";
import { RetryService } from "../../retry/retry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { HealthMonitorService } from "./health-monitor.service";

export class FallbackService {
  private readonly retryService = new RetryService();
  private readonly circuitBreaker = new CircuitBreakerService();
  private readonly healthMonitor = new HealthMonitorService();

  constructor(
    private readonly providerFactory: ProviderFactory,
  ) {}

  public async tryProviders(
    providers: string[],
    prompt: string,
  ): Promise<FallbackResult> {
    for (const providerName of providers) {
      if (!this.healthMonitor.isHealthy(providerName)) {
        continue;
      }

      if (this.circuitBreaker.isOpen(providerName)) {
        continue;
      }

      try {
        const provider =
          this.providerFactory.getProvider(providerName);

        const generated =
          await this.retryService.execute(() =>
            provider.generate({ prompt }),
          );

        this.circuitBreaker.recordSuccess(providerName);
        this.healthMonitor.update(providerName, true);

        return {
          provider: providerName,
          success: true,
          text: generated.text,
        };
      } catch (error) {
        this.circuitBreaker.recordFailure(providerName);
        this.healthMonitor.update(providerName, false);

        // Reserved for future logging
        const _message =
          error instanceof Error
            ? error.message
            : "Unknown error";

        continue;
      }
    }

    return {
      provider: "",
      success: false,
      error: "All providers failed.",
    };
  }
}