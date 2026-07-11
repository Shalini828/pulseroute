import { Router } from "express";
import { GatewayController } from "./gateway.controller";
import { validateGatewayRequest } from "./gateway.validation";
import { authenticate } from "../auth/auth.middleware";

const gatewayRouter = Router();

const gatewayController = new GatewayController();

gatewayRouter.get(
  "/history",
  authenticate,
  gatewayController.getHistory.bind(gatewayController),
);

gatewayRouter.post(
  "/",
  authenticate,
  validateGatewayRequest,
  gatewayController.handleRequest.bind(gatewayController),
);

export default gatewayRouter;
