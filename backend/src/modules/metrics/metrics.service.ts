import { ProviderMetrics } from "./metrics.types";

/**
 * In-memory metrics collection for AI providers.
 * Stores counters and response time aggregates for each provider.
 */
export class MetricsService {
  private readonly metrics = new Map<string, ProviderMetrics>();

  constructor() {
    // Initialize metrics for known providers.
    const initial: ProviderMetrics[] = [
      {
        provider: "gemini",
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        totalResponseTime: 0,
        status: "healthy",
      },
      {
        provider: "groq",
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        totalResponseTime: 0,
        status: "healthy",
      },
      {
        provider: "openai",
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        totalResponseTime: 0,
        status: "healthy",
      },
    ];

    for (const m of initial) {
      this.metrics.set(m.provider.toLowerCase(), { ...m });
    }
  }

  /**
   * Returns all provider metrics as an array.
   */
  public getMetrics(): ProviderMetrics[] {
    return Array.from(this.metrics.values()).map((m) => ({ ...m }));
  }

  /**
   * Record a successful request for the given provider and update timings.
   */
  public recordSuccess(provider: string, responseTime: number): void {
    console.log(">>> recordSuccess called", provider, responseTime);
    console.log(">>> Before:", this.getMetrics());

    const key = provider.trim().toLowerCase();
    const m = this.metrics.get(key);
    if (!m) return;

    m.totalRequests += 1;
    m.successfulRequests += 1;
    m.totalResponseTime += responseTime;
    m.averageResponseTime =
      m.successfulRequests > 0 ? m.totalResponseTime / m.successfulRequests : 0;

    this.metrics.set(key, { ...m });

    console.log(">>> After:", this.getMetrics());
  }
  
  /**
   * Record a failed request for the given provider.
   */
  public recordFailure(provider: string): void {
    const key = provider.trim().toLowerCase();
    const m = this.metrics.get(key);
    if (!m) return;

    m.totalRequests += 1;
    m.failedRequests += 1;

    this.metrics.set(key, { ...m });
  }
}

/**
 * Shared singleton instance.
 */
export const metricsService = new MetricsService();
