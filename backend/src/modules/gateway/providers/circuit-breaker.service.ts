export interface CircuitState {
  failures: number;
  openedAt?: number;
}

export class CircuitBreakerService {
  private static readonly MAX_FAILURES = 3;
  private static readonly RESET_TIMEOUT = 30_000;

  private readonly circuits = new Map<string, CircuitState>();

  public recordFailure(provider: string): void {
    const state =
      this.circuits.get(provider) ?? { failures: 0 };

    state.failures++;

    if (
      state.failures >= CircuitBreakerService.MAX_FAILURES
    ) {
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

    if (
      elapsed >= CircuitBreakerService.RESET_TIMEOUT
    ) {
      this.circuits.delete(provider);
      return false;
    }

    return true;
  }
}