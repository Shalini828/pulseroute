import { redisClient } from "../../redis/redis.client";

export class CacheService {
  private readonly TTL = 300; // 5 minutes (seconds)

  private cacheHits = 0;
  private cacheMisses = 0;

  public async get(key: string): Promise<string | null> {
    const cached = await redisClient.get(key);

    if (!cached) {
      this.cacheMisses++;
      return null;
    }

    this.cacheHits++;
    return cached;
  }

  public async set(key: string, response: string): Promise<void> {
    console.log("Redis SET:", key);

    await redisClient.set(key, response, {
      EX: this.TTL,
    });
  }

  public async getStats() {
    const size = await redisClient.dbSize();

    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate:
        this.cacheHits + this.cacheMisses === 0
          ? 0
          : (this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100,
      size,
    };
  }
}

export const cacheService = new CacheService();