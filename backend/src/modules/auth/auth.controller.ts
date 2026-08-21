import type { Request, Response } from "express";
import { authService } from "./auth.service";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "./auth.types";
import { successResponse, errorResponse } from "../../shared/utils/apiResponse";

export class AuthController {
  public async register(
    req: Request<unknown, unknown, RegisterRequest>,
    res: Response,
  ): Promise<Response> {
    const user = await authService.register(req.body);

    return successResponse(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      "User registered successfully.",
      201,
    );
  }

  public async login(
    req: Request<unknown, unknown, LoginRequest>,
    res: Response,
  ): Promise<Response> {
    const response = await authService.login(req.body);
    console.log("Controller req.body:", req.body);
    console.log("Controller response:", response);

    return successResponse(res, response, "Login successful.");
  }

  public async forgotPassword(
    req: Request<unknown, unknown, ForgotPasswordRequest>,
    res: Response,
  ): Promise<Response> {
    const response = await authService.forgotPassword(req.body);

    return successResponse(res, response, response.message);
  }

  public async resetPassword(
    req: Request<unknown, unknown, ResetPasswordRequest>,
    res: Response,
  ): Promise<Response> {
    const response = await authService.resetPassword(req.body);

    return successResponse(res, response, response.message);
  }

  public async getCurrentUser(req: Request, res: Response): Promise<Response> {
    if (!req.user?.userId) {
      return errorResponse(res, "Authentication required.", 401);
    }

    const currentUser = await authService.getCurrentUser(req.user.userId);

    return successResponse(
      res,
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
      "Current user fetched successfully.",
    );
  }

  public async getUsers(_req: Request, res: Response): Promise<Response> {
    const users = await authService.getUsers();

    return successResponse(
      res,
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
      "Users fetched successfully.",
    );
  }
}
