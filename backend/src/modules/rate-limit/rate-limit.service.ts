class RateLimitService {
  private requests = new Map<
    string,
    {
      count: number;
      resetTime: number;
    }
  >();

  private readonly LIMIT = 10;
  private readonly WINDOW_MS = 60 * 1000;

  check(clientId: string) {
    const now = Date.now();

    const client = this.requests.get(clientId);

    if (!client || now > client.resetTime) {
      this.requests.set(clientId, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });

      return {
        allowed: true,
        remaining: this.LIMIT - 1,
      };
    }

    if (client.count >= this.LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((client.resetTime - now) / 1000),
      };
    }

    client.count++;

    return {
      allowed: true,
      remaining: this.LIMIT - client.count,
    };
  }
}

export const rateLimitService = new RateLimitService();