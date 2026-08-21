import { Router } from "express";
import { analyticsController } from "./analytics.controller";

const router = Router();

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get overall analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Overview analytics retrieved successfully
 */
router.get(
  "/overview",
  analyticsController.getOverview.bind(analyticsController),
);

/**
 * @swagger
 * /analytics/providers:
 *   get:
 *     summary: Get provider analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Provider analytics retrieved successfully
 */
router.get(
  "/providers",
  analyticsController.getProviderAnalytics.bind(analyticsController),
);

/**
 * @swagger
 * /analytics/daily:
 *   get:
 *     summary: Get daily analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Daily analytics retrieved successfully
 */
router.get(
  "/daily",
  analyticsController.getDailyAnalytics.bind(analyticsController),
);

/**
 * @swagger
 * /analytics/recent:
 *   get:
 *     summary: Get recent gateway requests
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Recent requests retrieved successfully
 */
router.get(
  "/recent",
  analyticsController.getRecentRequests.bind(analyticsController),
);

/**
 * @swagger
 * /analytics/operational-stats:
 *   get:
 *     summary: Get operational statistics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Operational statistics retrieved successfully
 */
router.get(
  "/operational-stats",
  analyticsController.getOperationalStats.bind(analyticsController),
);

export default router;
