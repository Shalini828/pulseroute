import { Router } from "express";
import { ProviderController } from "./provider.controller";
import { authenticate } from "../auth/auth.middleware";

const providerRouter = Router();
const providerController = new ProviderController();

providerRouter.get(
  "/health",
  providerController.getProviders.bind(providerController),
);

providerRouter.post(
  "/projects/:projectId/providers",
  authenticate,
  providerController.createProvider.bind(providerController),
);

export default providerRouter;