import { Router } from "express";
import { MetricsController } from "./metrics.controller";

const metricsRouter = Router();

const metricsController = new MetricsController();

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get provider metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
metricsRouter.get("/", metricsController.getMetrics.bind(metricsController));

export default metricsRouter;