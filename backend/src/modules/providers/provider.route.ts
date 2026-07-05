import { Router } from "express";
import { ProviderController } from "./provider.controller";

/**
 * Defines the HTTP routes for the Provider module.
 */
const providerRouter = Router();
const providerController = new ProviderController();

/**
 * GET /health
 * Returns a list of configured providers and their health status.
 */
providerRouter.get(
  "/health",
  providerController.getProviders.bind(providerController),
);

export default providerRouter;
