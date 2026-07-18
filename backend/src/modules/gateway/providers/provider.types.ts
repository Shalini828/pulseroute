export interface ProviderInfo {
  name: string;
  priority: number;
  status: "healthy" | "unhealthy";
}

export interface FallbackResult {
  provider: string;
  success: boolean;
  response?: string;
  error?: string;
}