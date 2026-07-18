export class RetryService {
  private readonly maxRetries = Number(process.env.RETRY_LIMIT) || 3;

  private readonly retryDelay = Number(process.env.RETRY_DELAY) || 500;

  public getMaxRetries(): number {
    return this.maxRetries;
  }

  public getRetryDelay(): number {
    return this.retryDelay;
  }

  public async wait(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Retry attempt ${attempt}`);

        return await operation();
      } catch (error) {
        lastError = error;
        const message =
          error instanceof Error ? error.message.toLowerCase() : "";

        const shouldRetry =
          message.includes("timeout") ||
          message.includes("429") ||
          message.includes("500") ||
          message.includes("502") ||
          message.includes("503") ||
          message.includes("504");

        console.log(`Attempt ${attempt} failed`);

        if (attempt < this.maxRetries && shouldRetry) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);

          console.log(`Waiting ${delay} ms before retry...`);

          await this.wait(delay);
        }
      }
    }

    throw lastError;
  }
}
