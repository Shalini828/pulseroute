import { NextFunction, Request, Response } from "express";
import { gatewayRequestSchema } from "./gateway.schema";

export const validateGatewayRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = gatewayRequestSchema.safeParse(req.body);

  if (!result.success) {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
}

  req.body = result.data;
  next();
};
