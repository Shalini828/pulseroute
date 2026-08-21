import { Response } from "express";

export const successResponse = (
  res: Response,
  data: unknown = null,
  message = "Success",
  statusCode = 200,
  meta: Record<string, unknown> = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const errorResponse = (
  res: Response,
  message = "Something went wrong",
  statusCode = 500,
  errors: unknown = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};