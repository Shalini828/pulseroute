import { Router } from "express";
import { MetricsController } from "./metrics.controller";

const metricsRouter = Router();

const metricsController = new MetricsController();

metricsRouter.get("/", metricsController.getMetrics.bind(metricsController));

export default metricsRouter;
