import type { Request, Response } from "express";
import { gatewayService } from "./gateway.service";
import type { GatewayRequest, GatewayResponse } from "./gateway.types";

export class GatewayController {
  private readonly service = gatewayService;

  public async handleRequest(
    req: Request<unknown, GatewayResponse, GatewayRequest>,
    res: Response<GatewayResponse>,
  ): Promise<Response<GatewayResponse>> {
    try {
      const request = req.body;
const project = req.project;

if (!project) {
  return res.status(401).json({
    success: false,
    provider: "",
    data: {
      text: "Invalid API key.",
    },
    timestamp: new Date().toISOString(),
  });
}

const gatewayResponse = await this.service.processRequest(
  request,
  project.id,
  req.user?.userId,
);
      return res.status(200).json(gatewayResponse);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({
        success: false,
        provider: "",
        data: {
          text: message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  public async getHistory(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const history = await this.service.getHistory(userId);

      return res.status(200).json({
        success: true,
        history,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({
        success: false,
        message,
      });
    }
  }
}

export const gatewayController = new GatewayController();
