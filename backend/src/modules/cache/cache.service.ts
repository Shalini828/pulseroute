export class CacheService {
  private readonly cache = new Map<
    string,
    {
      response: string;
      expiresAt: number;
    }
  >();

  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private cacheHits = 0;
  private cacheMisses = 0;
  public get(key: string): string | null {
    const cached = this.cache.get(key);

    if (!cached) {
      this.cacheMisses++;
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    this.cacheHits++;

    return cached.response;
  }

  public set(key: string, response: string): void {
    console.log("Cache SET:", key);
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + this.TTL,
    });
  }

  public getStats() {
  return {
    hits: this.cacheHits,
    misses: this.cacheMisses,
    hitRate:
      this.cacheHits + this.cacheMisses === 0
        ? 0
        : (this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100,
    size: this.cache.size,
  };
}
}

export const cacheService = new CacheService();
