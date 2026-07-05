import { Router } from "express";
import { GatewayController } from "./gateway.controller";
import { validateGatewayRequest } from "./gateway.validation";

/**
 * Defines the HTTP routes for the Gateway module.
 * Routes should only map endpoints to controller methods.
 */
const gatewayRouter = Router();

const gatewayController = new GatewayController();

/**
 * POST /
 *
 * Accepts a gateway request and forwards it
 * to the GatewayController.
 */
gatewayRouter.post(
  "/",
  validateGatewayRequest,
  gatewayController.handleRequest.bind(gatewayController),
);

export default gatewayRouter;
