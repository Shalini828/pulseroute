import { Request, Response } from "express";
import { rateLimitService } from "./rate-limit.service";

export const getRateLimitStatus = async (
  req: Request,
  res: Response,
) => {
  const clientId = req.ip || "unknown";

  const result = await rateLimitService.check(clientId);

  if (!result.allowed) {
    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded",
      retryAfter: result.retryAfter,
    });
  }

  return res.json({
    success: true,
    remaining: result.remaining,
  });
};