import { ProviderInfo } from "./provider.types";
import { ProviderFactory } from "./provider.factory";

export class ProviderHealthService {
  private readonly providerFactory = new ProviderFactory();
  private readonly providers: ProviderInfo[];

  constructor() {
    this.providers = this.providerFactory.getProviderNames().map(
      (name, index) => ({
        name,
        priority: index + 1,
        status: "healthy",
      }),
    );
  }

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

  public isHealthy(name: string): boolean {
    const provider = this.findProvider(name);

    return provider?.status === "healthy";
  }

  public updatePriority(name: string, priority: number): void {
    const provider = this.findProvider(name);

    if (provider) {
      provider.priority = priority;
    }
  }

  private findProvider(name: string): ProviderInfo | undefined {
    return this.providers.find(
      (provider) =>
        provider.name.toLowerCase() === name.trim().toLowerCase(),
    );
  }
}