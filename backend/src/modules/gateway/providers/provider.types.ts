/** Health status for a gateway provider. */
export type ProviderStatus = "healthy" | "unhealthy";

/** Metadata for a provider, including priority and current health. */
export interface ProviderInfo {
  name: string;
  priority: number;
  status: ProviderStatus;
}

/** Result of attempting to use a fallback provider. */
export interface FallbackResult {
  provider: string;
  success: boolean;
  response?: string;
  error?: string;
}
