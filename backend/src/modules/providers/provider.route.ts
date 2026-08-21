import { Router } from "express";
import { providerController } from "./provider.controller";
import { authenticate } from "../auth/auth.middleware";

const providerRouter = Router();

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Get all available AI providers
 *     tags: [Providers]
 *     responses:
 *       200:
 *         description: List of providers retrieved successfully
 */
providerRouter.get(
  "/",
  providerController.getProviders.bind(providerController),
);

/**
 * @swagger
 * /providers/projects/{projectId}/providers:
 *   post:
 *     summary: Add a provider to a project
 *     tags: [Providers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Provider created successfully
 *       401:
 *         description: Unauthorized
 */
providerRouter.post(
  "/projects/:projectId/providers",
  authenticate,
  providerController.createProvider.bind(providerController),
);

/**
 * @swagger
 * /providers/projects/{projectId}/providers:
 *   get:
 *     summary: Get all providers for a project
 *     tags: [Providers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project providers retrieved successfully
 */
providerRouter.get(
  "/projects/:projectId/providers",
  authenticate,
  providerController.getProvidersByProject.bind(providerController),
);

/**
 * @swagger
 * /providers/projects/{projectId}/providers/{providerId}:
 *   get:
 *     summary: Get provider by ID
 *     tags: [Providers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider retrieved successfully
 *       404:
 *         description: Provider not found
 */
providerRouter.get(
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.getProviderById.bind(providerController),
);

/**
 * @swagger
 * /providers/projects/{projectId}/providers/{providerId}:
 *   patch:
 *     summary: Update a provider
 *     tags: [Providers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider updated successfully
 */
providerRouter.patch(
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.updateProvider.bind(providerController),
);

/**
 * @swagger
 * /providers/projects/{projectId}/providers/{providerId}:
 *   delete:
 *     summary: Delete a provider
 *     tags: [Providers]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider deleted successfully
 */
providerRouter.delete(
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.deleteProvider.bind(providerController),
);

export default providerRouter;