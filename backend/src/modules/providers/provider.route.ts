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

providerRouter.get(
  "/projects/:projectId/providers",
  authenticate,
  providerController.getProvidersByProject.bind(providerController),
);

providerRouter.get(
  "/:providerId",
  authenticate,
  providerController.getProviderById.bind(providerController),
);

providerRouter.patch(
  "/:providerId",
  authenticate,
  providerController.updateProvider.bind(providerController),
);

providerRouter.delete(
  "/:providerId",
  authenticate,
  providerController.deleteProvider.bind(providerController),
);
export default providerRouter;