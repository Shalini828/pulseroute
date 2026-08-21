import type { Request, Response } from "express";
import { gatewayService } from "./gateway.service";
import type { GatewayRequest, GatewayResponse } from "./gateway.types";
import { projectService } from "../projects/project.service";

export class GatewayController {
  private readonly service = gatewayService;

  public async handleRequest(
    req: Request<unknown, GatewayResponse, GatewayRequest>,
    res: Response<GatewayResponse>,
  ): Promise<void> {
    try {
      const project = req.project;

      if (!project) {
        res.status(401).json({
          success: false,
          jobId: "",
          status: "FAILED",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const gatewayResponse = await this.service.processRequest(
        req.body,
        project.id,
        req.user?.userId,
      );

      console.log("Sending success response");
      res.status(200).json(gatewayResponse);
    } catch (error) {
      console.error("Gateway controller catch:", error);

      if (res.headersSent) {
        console.log("Headers already sent");
        return;
      }

      const message =
        error instanceof Error ? error.message : "Internal server error";

      const statusCode = message.startsWith("Rate limit exceeded") ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        jobId: "",
        status: "FAILED",
        timestamp: new Date().toISOString(),
      });
    }
  }

  public async handlePlaygroundRequest(
    req: Request<unknown, GatewayResponse, GatewayRequest>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          jobId: "",
          status: "FAILED",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const projectId = req.body.projectId;

      if (!projectId) {
        res.status(400).json({
          success: false,
          jobId: "",
          status: "FAILED",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const gatewayResponse = await this.service.processRequest(
        req.body,
        projectId,
        userId,
      );

      res.status(200).json(gatewayResponse);
    } catch (error) {
      console.error("Playground gateway error:", error);

      if (res.headersSent) {
        return;
      }

      res.status(500).json({
        success: false,
        jobId: "",
        status: "FAILED",
        timestamp: new Date().toISOString(),
      });
    }
  }

  public async handleStreamRequest(
    req: Request<unknown, unknown, GatewayRequest>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
        return;
      }

      const projectId = req.body.projectId;

      if (!projectId) {
        res.status(400).json({
          success: false,
          message: "Project ID is required.",
        });
        return;
      }

      // Tell browser this is an SSE stream
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send headers immediately
      res.flushHeaders();

      const result = await this.service.processStreamRequest(
        req.body,
        projectId,
        userId,
        (chunk: string) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
      );

      // Send final information
      res.write(
        `data: ${JSON.stringify({
          done: true,
          provider: result.provider,
          latency: result.latency,
        })}\n\n`,
      );

      res.write("data: [DONE]\n\n");

      res.end();
    } catch (error) {
      console.error("Streaming gateway error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Streaming request failed.",
        });
        return;
      }

      res.write(
        `data: ${JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Streaming request failed.",
        })}\n\n`,
      );

      res.end();
    }
  }
  public async getHistory(req: Request, res: Response): Promise<Response> {
    try {
      console.log("JWT User:", req.user);
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
