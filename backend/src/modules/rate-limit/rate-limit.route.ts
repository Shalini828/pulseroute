import { Router } from "express";
import { getRateLimitStatus } from "./rate-limit.controller";

const router = Router();

/**
 * @swagger
 * /rate-limit/status:
 *   get:
 *     summary: Get current rate limit status
 *     tags: [Rate Limit]
 *     responses:
 *       200:
 *         description: Rate limit status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
router.get("/status", getRateLimitStatus);

export default router;