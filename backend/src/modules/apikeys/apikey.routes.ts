import { Router } from "express";
import { ApiKeyController } from "./apikey.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();
const controller = new ApiKeyController();

/**
 * POST /projects/:projectId/apikeys
 */
router.post(
  "/projects/:projectId/apikeys",
  authenticate,
  controller.createApiKey.bind(controller),
);

router.get(
  "/projects/:projectId/apikeys",
  authenticate,
  controller.getApiKeys.bind(controller),
);

router.patch(
  "/:apiKeyId/revoke",
  authenticate,
  controller.revokeApiKey.bind(controller),
);

router.delete(
  "/:apiKeyId",
  authenticate,
  controller.deleteApiKey.bind(controller),
);

export default router;