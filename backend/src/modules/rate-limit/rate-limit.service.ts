import { redisClient } from "../../redis/redis.client";

class RateLimitService {
  private readonly LIMIT = 10;
  private readonly WINDOW_SECONDS = 60;

  public async check(clientId: string) {
    const key = `ratelimit:${clientId}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, this.WINDOW_SECONDS);
    }

    if (current > this.LIMIT) {
      const retryAfter = await redisClient.ttl(key);

      return {
        allowed: false,
        remaining: 0,
        retryAfter,
      };
    }

    return {
      allowed: true,
      remaining: this.LIMIT - current,
    };
  }
}

export const rateLimitService = new RateLimitService();