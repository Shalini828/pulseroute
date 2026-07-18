import { ProviderFactory } from "./provider.factory";
import type { FallbackResult } from "./provider.types";
import { RetryService } from "../../retry/retry.service";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { HealthMonitorService } from "./health-monitor.service";

export class FallbackService {
  private readonly retryService = new RetryService();
  private readonly circuitBreaker = new CircuitBreakerService();
  private readonly healthMonitor = new HealthMonitorService();

  constructor(private readonly providerFactory: ProviderFactory) {}

  public async tryProviders(
    providers: string[],
    prompt: string,
  ): Promise<FallbackResult> {
    for (const providerName of providers) {
      // Skip unhealthy providers
      if (!this.healthMonitor.isHealthy(providerName)) {
        console.log(`Skipping ${providerName} because it is unhealthy`);
        continue;
      }

      // Skip providers whose circuit is open
      if (this.circuitBreaker.isOpen(providerName)) {
        console.log(`Skipping ${providerName} because circuit is OPEN`);
        continue;
      }

      try {
        const generated = await this.retryService.execute(async () => {
          // TEMPORARY: Force Gemini to fail
          if (providerName === "gemini") {
            throw new Error("503 Service Unavailable");
          }

          const provider = this.providerFactory.getProvider(providerName);
          return provider.generate({ prompt });
        });

        this.circuitBreaker.recordSuccess(providerName);
        this.healthMonitor.update(providerName, true);

        return {
          provider: providerName,
          success: true,
          response: generated.text,
        };
      } catch (error) {
        console.error(`Provider ${providerName} failed:`, error);

        this.circuitBreaker.recordFailure(providerName);
        this.healthMonitor.update(providerName, false);

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
