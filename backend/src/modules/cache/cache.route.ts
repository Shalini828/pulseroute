import { Router } from "express";
import { cacheController } from "./cache.controller";

const cacheRouter = Router();

/**
 * @swagger
 * /cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Cache statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
cacheRouter.get(
  "/stats",
  cacheController.getStats.bind(cacheController),
);

export default cacheRouter;