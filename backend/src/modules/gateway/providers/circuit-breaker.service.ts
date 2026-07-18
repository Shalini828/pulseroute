export interface CircuitState {
  failures: number;
  openedAt?: number;
}

export class CircuitBreakerService {
  private readonly maxFailures = 3;
  private readonly resetTimeout = 30000;

  private readonly circuits = new Map<string, CircuitState>();

  public recordFailure(provider: string): void {
    const state =
      this.circuits.get(provider) ?? { failures: 0 };

    state.failures++;

    if (state.failures >= this.maxFailures) {
      state.openedAt = Date.now();
    }

    this.circuits.set(provider, state);
  }

  public recordSuccess(provider: string): void {
    this.circuits.delete(provider);
  }

public isOpen(provider: string): boolean {
  const state = this.circuits.get(provider);

  if (!state) {
    return false;
  }

  if (!state.openedAt) {
    return false;
  }

  const elapsed = Date.now() - state.openedAt;

  if (elapsed >= this.resetTimeout) {
    this.circuits.delete(provider);
    return false;
  }

  return true;
}
}