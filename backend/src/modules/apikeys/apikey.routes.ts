import { Router } from "express";
import { apiKeyController } from "./apikey.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router({
  mergeParams: true,
});

/**
 * @swagger
 * /apikeys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       201:
 *         description: API key created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  apiKeyController.createApiKey.bind(apiKeyController),
);

/**
 * @swagger
 * /apikeys:
 *   get:
 *     summary: Get all API keys
 *     tags: [API Keys]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: API keys retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authenticate,
  apiKeyController.getApiKeys.bind(apiKeyController),
);

/**
 * @swagger
 * /apikeys/{apiKeyId}/revoke:
 *   patch:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *       404:
 *         description: API key not found
 */
router.patch(
  "/:apiKeyId/revoke",
  authenticate,
  apiKeyController.revokeApiKey.bind(apiKeyController),
);

/**
 * @swagger
 * /apikeys/{apiKeyId}:
 *   delete:
 *     summary: Delete an API key
 *     tags: [API Keys]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API key deleted successfully
 *       404:
 *         description: API key not found
 */
router.delete(
  "/:apiKeyId",
  authenticate,
  apiKeyController.deleteApiKey.bind(apiKeyController),
);

export default router;