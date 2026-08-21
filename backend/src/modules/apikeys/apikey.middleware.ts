import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { apiKeyService } from "./apikey.service";
import { errorResponse } from "../../shared/utils/apiResponse";

declare global {
  namespace Express {
    interface Request {
      project?: {
        id: string;
        name: string;
        userId: string;
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
    // ============================================
    // GET API KEY FROM HEADER
    // ============================================

    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      errorResponse(
        res,
        "API key is required.",
        401,
      );
      return;
    }

    // ============================================
    // VALIDATE API KEY
    // ============================================

    const project =
      await apiKeyService.getProjectFromApiKey(
        apiKey,
      );

    // ============================================
    // ATTACH PROJECT TO REQUEST
    // ============================================

    req.project = {
      id: project.id,
      name: project.name,
      userId: project.userId,
    };

    // ============================================
    // ATTACH USER TO REQUEST
    // ============================================

    req.user = {
      userId: project.userId,
    };

    next();
  } catch (error) {
    console.error(
      "API key authentication failed:",
      error,
    );

    errorResponse(
      res,
      "Invalid API key.",
      401,
    );
  }
};