import { Router } from "express";
import { gatewayController } from "./gateway.controller";
import { validateGatewayRequest } from "./gateway.validation";
import { authenticate } from "../auth/auth.middleware";
import { authenticateApiKey } from "../apikeys/apikey.middleware";

const gatewayRouter = Router();

gatewayRouter.get(
  "/history",
  authenticate,
  gatewayController.getHistory.bind(gatewayController),
);

gatewayRouter.post(
  "/",
  authenticateApiKey,
  validateGatewayRequest,
  gatewayController.handleRequest.bind(gatewayController),
);

export default gatewayRouter;