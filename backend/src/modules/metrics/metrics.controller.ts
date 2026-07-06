import type { Request, Response } from "express";
import { metricsService } from "./metrics.service";
import type { ProviderMetrics } from "./metrics.types";

export class MetricsController {
  private readonly metricsService = metricsService;

  public getMetrics(
    _req: Request,
    res: Response<{ success: true; metrics: ProviderMetrics[] }>,
  ): Response<{ success: true; metrics: ProviderMetrics[] }> {
    const metrics = this.metricsService.getMetrics();
    console.log("Controller metrics:", metrics);

    return res.status(200).json({
      success: true,
      metrics,
    });
  }
}
