import { Request, Response } from "express";
import { cacheService } from "./cache.service";

export class CacheController {
  public getStats(_req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      cache: cacheService.getStats(),
    });
  }
}

export const cacheController = new CacheController();