import type { Request, Response } from "express";
import { apiKeyService } from "./apikey.service";
import type { CreateApiKeyRequest } from "./apikey.types";

export class ApiKeyController {
  /**
   * Generate a new API key.
   */
  public async createApiKey(
    req: Request<
      { projectId: string },
      unknown,
      CreateApiKeyRequest
    >,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const apiKey = await apiKeyService.createApiKey(
      req.user.userId,
      req.params.projectId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "API key generated successfully.",
      data: apiKey,
    });
  }

  /**
   * Get all API keys for a project.
   */
  public async getApiKeys(
    req: Request<{ projectId: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const keys = await apiKeyService.getApiKeys(
      req.user.userId,
      req.params.projectId,
    );

    return res.status(200).json({
      success: true,
      data: keys,
    });
  }

public async revokeApiKey(
  req: Request<{ projectId: string; apiKeyId: string }>,
  res: Response,
): Promise<Response> {
  if (!req.user?.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  await apiKeyService.revokeApiKey(
    req.user.userId,
    req.params.projectId,
    req.params.apiKeyId,
  );

  return res.status(200).json({
    success: true,
    message: "API key revoked successfully.",
  });
}

public async deleteApiKey(
  req: Request<{ projectId: string; apiKeyId: string }>,
  res: Response,
): Promise<Response> {
  if (!req.user?.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  await apiKeyService.deleteApiKey(
    req.user.userId,
    req.params.projectId,
    req.params.apiKeyId,
  );

  return res.status(200).json({
    success: true,
    message: "API key deleted successfully.",
  });
}

}

export const apiKeyController = new ApiKeyController();