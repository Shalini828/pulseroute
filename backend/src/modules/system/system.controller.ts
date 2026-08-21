import { Request, Response, NextFunction } from "express";
import { systemService } from "./system.service";

export class SystemController {
  public async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await systemService.getSystemHealth();

      return res.status(200).json({
        success: true,
        data: health,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const systemController = new SystemController();
