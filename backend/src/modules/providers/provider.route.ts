import { Router } from "express";
import { providerController } from "./provider.controller";
import { authenticate } from "../auth/auth.middleware";

const providerRouter = Router();


providerRouter.get(
  "/",
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
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.getProviderById.bind(providerController),
);

providerRouter.patch(
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.updateProvider.bind(providerController),
);


providerRouter.delete(
  "/projects/:projectId/providers/:providerId",
  authenticate,
  providerController.deleteProvider.bind(providerController),
);

export default providerRouter;