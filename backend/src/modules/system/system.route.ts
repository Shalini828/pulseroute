import { Router } from "express";
import { systemController } from "./system.controller";

const router = Router();

/**
 * @swagger
 * /system/health:
 *   get:
 *     summary: Get comprehensive system health status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded, unhealthy]
 *                     timestamp:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/health", systemController.getHealth.bind(systemController));

export default router;
