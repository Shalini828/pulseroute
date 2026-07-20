import type { NextFunction, Request, Response } from "express";
import { apiKeyService } from "./apikey.service";

declare global {
  namespace Express {
    interface Request {
      project?: {
        id: string;
        name: string;
      };
    }
  }
}

export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: "API key is required.",
      });
      return;
    }

    const project = await apiKeyService.getProjectFromApiKey(apiKey);

    req.project = {
      id: project.id,
      name: project.name,
    };

    req.user = {
      userId: project.userId,
    };

    next();

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid API key.",
    });
  }
};
