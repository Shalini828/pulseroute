import { ProviderInfo } from "./provider.types";

/**
 * Tracks gateway provider health and prioritization in memory.
 */
export class ProviderHealthService {
  private readonly providers: ProviderInfo[] = [
  { name: "gemini", priority: 1, status: "healthy" },
  { name: "groq", priority: 2, status: "healthy" },
  { name: "openai", priority: 3, status: "healthy" },
  ];

  /**
   * Returns all configured providers.
   */
  public getProviders(): ProviderInfo[] {
    return [...this.providers];
  }

  /**
   * Returns only healthy providers sorted by priority.
   */
  public getHealthyProviders(): ProviderInfo[] {
    return this.providers
      .filter((provider) => provider.status === "healthy")
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Marks the named provider as healthy.
   */
  public markHealthy(name: string): void {
    const provider = this.findProvider(name);
    if (provider) {
      provider.status = "healthy";
    }
  }

  /**
   * Marks the named provider as unhealthy.
   */
  public markUnhealthy(name: string): void {
    const provider = this.findProvider(name);
    if (provider) {
      provider.status = "unhealthy";
    }
  }

  private findProvider(name: string): ProviderInfo | undefined {
    return this.providers.find(
      (provider) => provider.name.toLowerCase() === name.trim().toLowerCase(),
    );
  }
}
