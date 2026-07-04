import type { Request, Response } from "express";
import { GatewayService } from "./gateway.service";
import type {
  GatewayRequest,
  GatewayResponse,
} from "./gateway.types";

/**
 * Handles HTTP requests for the Gateway module.
 * Controllers should remain thin and delegate
 * business logic to the service layer.
 */
export class GatewayController {
  constructor(
    private readonly gatewayService = new GatewayService()
  ) {}

  public async handleRequest(
    req: Request<unknown, GatewayResponse, GatewayRequest>,
    res: Response<GatewayResponse>
  ): Promise<Response<GatewayResponse>> {
    const request: GatewayRequest = req.body;

    const gatewayResponse =
      this.gatewayService.processRequest(request);

    return res.status(200).json(gatewayResponse);
  }
}