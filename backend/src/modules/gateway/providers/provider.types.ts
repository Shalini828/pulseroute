export interface ProviderInfo {
  name: string;
  priority: number;
  status: "healthy" | "unhealthy";
}

export interface FallbackResult {
  provider: string;
  success: boolean;

  text?: string;

  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };

  error?: string;
}