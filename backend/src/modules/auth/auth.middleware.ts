import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./auth.types";

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

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  console.log("Scheme:", scheme);
  console.log("Token:", token);

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "Invalid Authorization header.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-secret",
    );

    console.log("Decoded JWT:", decoded);

    if (!isJwtPayload(decoded)) {
      console.log("JWT payload format invalid.");

      res.status(401).json({
        success: false,
        message: "Invalid token payload.",
      });
      return;
    }

    req.user = decoded;

    console.log("Authenticated User:", req.user);

    next();
  } catch (error) {
    console.error("JWT Verify Error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};