import type { Request, Response } from "express";
import { authService } from "./auth.service";
import type { RegisterRequest, LoginRequest } from "./auth.types";

/**
 * Handles HTTP requests for authentication.
 */
export class AuthController {
  /**
   * Registers a new user.
   */
  public async register(
    req: Request<unknown, unknown, RegisterRequest>,
    res: Response,
  ): Promise<Response> {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }

  /**
   * Logs in an existing user.
   */
  public async login(
    req: Request<unknown, unknown, LoginRequest>,
    res: Response,
  ): Promise<Response> {
    const response = await authService.login(req.body);
    console.log("Controller req.body:", req.body);
    console.log("Controller response:", response);

    return res.status(200).json(response);
  }

  /**
   * Returns the authenticated user's profile.
   */
  public async getCurrentUser(req: Request, res: Response): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const currentUser = await authService.getCurrentUser(req.user.userId);

    return res.status(200).json({
      success: true,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
    });
  }

  /**
   * Temporary endpoint to list registered users.
   * Remove after Prisma integration.
   */
  public async getUsers(_req: Request, res: Response): Promise<Response> {
    const users = await authService.getUsers();

    return res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    });
  }
}
