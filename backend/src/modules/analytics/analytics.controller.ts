import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  public async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await analyticsService.getOverview();

      return res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProviderAnalytics(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const providers = await analyticsService.getProviderAnalytics();

      return res.status(200).json({
        success: true,
        data: providers,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getDailyAnalytics(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const daily = await analyticsService.getDailyAnalytics();

      return res.status(200).json({
        success: true,
        data: daily,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getRecentRequests(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const recent = await analyticsService.getRecentRequests();

      return res.status(200).json({
        success: true,
        data: recent,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOperationalStats(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const stats = await analyticsService.getOperationalStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
