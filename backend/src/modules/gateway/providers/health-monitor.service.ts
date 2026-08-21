export interface ProviderHealth {
  provider: string;
  healthy: boolean;
  checkedAt: Date;
}

export class HealthMonitorService {
  private readonly health = new Map<string, ProviderHealth>();

  public update(provider: string, healthy: boolean): void {
    const normalizedProvider = provider.trim().toLowerCase();

    this.health.set(normalizedProvider, {
      provider: normalizedProvider,
      healthy,
      checkedAt: new Date(),
    });
  }

  public markHealthy(provider: string): void {
    this.update(provider, true);
  }

  public markUnhealthy(provider: string): void {
    this.update(provider, false);
  }

  public isHealthy(provider: string): boolean {
    const normalizedProvider = provider.trim().toLowerCase();

    return this.health.get(normalizedProvider)?.healthy ?? true;
  }

  public getHealth(provider: string): ProviderHealth | undefined {
    const normalizedProvider = provider.trim().toLowerCase();

    const health = this.health.get(normalizedProvider);

    return health ? { ...health } : undefined;
  }

  public getAll(): ProviderHealth[] {
    return [...this.health.values()].map((provider) => ({
      ...provider,
    }));
  }
}