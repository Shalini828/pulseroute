import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./auth.types";

/**
 * Extend Express Request type to include user payload.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const isJwtPayload = (value: unknown): value is JwtPayload => {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof (value as JwtPayload).userId === "string" &&
    "email" in value &&
    typeof (value as JwtPayload).email === "string"
  );
};

/**
 * Authentication middleware that verifies JWT tokens.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET || "development-secret",
);

    if (!isJwtPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
