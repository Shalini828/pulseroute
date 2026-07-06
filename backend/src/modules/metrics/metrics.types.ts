/**
 * Metrics recorded for a single provider.
 * All times are measured in milliseconds and counts are integer values.
 */
export interface ProviderMetrics {
  /** Provider identifier (e.g., "openai", "gemini"). */
  provider: string;
  /** Total number of requests attempted. */
  totalRequests: number;
  /** Number of successful responses. */
  successfulRequests: number;
  /** Number of failed responses. */
  failedRequests: number;
  /** Average response time in milliseconds. */
  averageResponseTime: number;
  /** Cumulative response time in milliseconds (for computing averages). */
  totalResponseTime: number;
  /** Current health status of the provider. */
  status: "healthy" | "unhealthy";
}
