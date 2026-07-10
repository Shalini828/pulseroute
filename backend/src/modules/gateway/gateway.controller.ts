import type { Request, Response } from "express";
import { GatewayService } from "./gateway.service";
import type { GatewayRequest, GatewayResponse } from "./gateway.types";

/**
 * Handles HTTP requests for the Gateway module.
 * Controllers should remain thin and delegate
 * business logic to the service layer.
 */
export class GatewayController {
  constructor(private readonly gatewayService = new GatewayService()) {}

  /**
   * POST /gateway
   */
  public async handleRequest(
    req: Request<unknown, GatewayResponse, GatewayRequest>,
    res: Response<GatewayResponse>,
  ): Promise<Response<GatewayResponse>> {
    const request: GatewayRequest = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        provider: "",
        data: {
          text: "Authentication required.",
        },
        timestamp: new Date().toISOString(),
      });
    }

    const gatewayResponse = await this.gatewayService.processRequest(
      request,
      userId,
    );

    return res.status(200).json(gatewayResponse);
  }

  /**
   * GET /gateway/history
   */
  public async getHistory(
    req: Request,
    res: Response,
  ): Promise<Response> {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const history = await this.gatewayService.getHistory(userId);

    return res.status(200).json({
      success: true,
      history,
    });
  }
}