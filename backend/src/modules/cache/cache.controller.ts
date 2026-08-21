import { Request, Response } from "express";
import { cacheService } from "./cache.service";

export class CacheController {
  public async getStats(_req: Request, res: Response) {
  const stats = await cacheService.getStats();

  return res.status(200).json({
    success: true,
    cache: stats,
  });
}
}

export const cacheController = new CacheController();