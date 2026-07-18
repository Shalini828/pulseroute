import { ProviderInfo } from "./provider.types";
export class ProviderHealthService {
  private readonly providers: ProviderInfo[] = [
  { name: "gemini", priority: 1, status: "healthy" },
  { name: "groq", priority: 2, status: "healthy" },
  { name: "openai", priority: 3, status: "healthy" },
  ];

  public getProviders(): ProviderInfo[] {
    return [...this.providers];
  }

  public getHealthyProviders(): ProviderInfo[] {
    return this.providers
      .filter((provider) => provider.status === "healthy")
      .sort((a, b) => a.priority - b.priority);
  }
  public markHealthy(name: string): void {
    const provider = this.findProvider(name);
    if (provider) {
      provider.status = "healthy";
    }
  }

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
