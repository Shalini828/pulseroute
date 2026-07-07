import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate as authenticateUser } from "./auth.middleware";

/**
 * Defines HTTP routes for authentication.
 */
const authRouter = Router();

const authController = new AuthController();
const authControllerWithCurrentUser = authController as AuthController & {
  getCurrentUser: typeof authController.getUsers;
};

/**
 * POST /register
 * Registers a new user.
 */
authRouter.post("/register", authController.register.bind(authController));

/**
 * POST /login
 * Logs in an existing user.
 */
authRouter.post("/login", authController.login.bind(authController));

/**
 * GET /users
 * Temporary endpoint for testing.
 * Remove after Prisma integration.
 */
authRouter.get("/users", authController.getUsers.bind(authController));

/**
 * GET /me
 * Returns the authenticated user's profile.
 * Protected route.
 */
authRouter.get(
  "/me",
  authenticateUser,
  authControllerWithCurrentUser.getCurrentUser.bind(authController),
);

export default authRouter;
