import { Router } from "express";
import { gatewayController } from "./gateway.controller";
import { validateGatewayRequest } from "./gateway.validation";
import { authenticate } from "../auth/auth.middleware";
import { authenticateApiKey } from "../apikeys/apikey.middleware";

const gatewayRouter = Router();

/**
 * @swagger
 * /gateway/history:
 *   get:
 *     summary: Get request history
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Request history retrieved successfully
 */
gatewayRouter.get(
  "/history",
  authenticate,
  gatewayController.getHistory.bind(gatewayController),
);

/**
 * @swagger
 * /gateway:
 *   post:
 *     summary: Submit an AI request
 *     tags: [Gateway]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Hello"
 *     responses:
 *       200:
 *         description: Job queued successfully
 *       401:
 *         description: Invalid or missing API key
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
gatewayRouter.post(
  "/",
  authenticateApiKey,
  validateGatewayRequest,
  gatewayController.handleRequest.bind(gatewayController),
);

gatewayRouter.post(
  "/playground",
  authenticate,
  validateGatewayRequest,
  gatewayController.handlePlaygroundRequest.bind(
    gatewayController,
  ),
);

gatewayRouter.post(
  "/playground/stream",
  authenticate,
  validateGatewayRequest,
  gatewayController.handleStreamRequest.bind(
    gatewayController,
  ),
);

/**
 * @swagger
 * /gateway/test:
 *   post:
 *     summary: Test gateway endpoint
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Test endpoint working
 */
gatewayRouter.post("/test", (_req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ success: true });
});

export default gatewayRouter;