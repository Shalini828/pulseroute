export interface ProviderHealth {
  provider: string;
  healthy: boolean;
  checkedAt: Date;
}

export class HealthMonitorService {
  private readonly health = new Map<string, ProviderHealth>();

  public update(
    provider: string,
    healthy: boolean,
  ): void {
    this.health.set(provider, {
      provider,
      healthy,
      checkedAt: new Date(),
    });
  }

  public isHealthy(provider: string): boolean {
    return this.health.get(provider)?.healthy ?? true;
  }

  public getAll(): ProviderHealth[] {
    return [...this.health.values()].map((provider) => ({
      ...provider,
    }));
  }
}