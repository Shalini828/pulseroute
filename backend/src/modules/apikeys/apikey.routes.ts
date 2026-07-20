import { Router } from "express";
import { apiKeyController } from "./apikey.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  authenticate,
  apiKeyController.createApiKey.bind(apiKeyController),
);

router.get(
  "/",
  authenticate,
  apiKeyController.getApiKeys.bind(apiKeyController),
);

router.patch(
  "/:apiKeyId/revoke",
  authenticate,
  apiKeyController.revokeApiKey.bind(apiKeyController),
);

router.delete(
  "/:apiKeyId",
  authenticate,
  apiKeyController.deleteApiKey.bind(apiKeyController),
);

export default router;