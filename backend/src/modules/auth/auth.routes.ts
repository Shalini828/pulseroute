import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate as authenticateUser } from "./auth.middleware";

const authRouter = Router();

const authController = new AuthController();
const authControllerWithCurrentUser = authController as AuthController & {
  getCurrentUser: typeof authController.getUsers;
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */
authRouter.post("/register", authController.register.bind(authController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", authController.login.bind(authController));

authRouter.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController),
);

authRouter.post(
  "/reset-password",
  authController.resetPassword.bind(authController),
);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
authRouter.get("/users", authController.getUsers.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       401:
 *         description: Unauthorized
 */
authRouter.get(
  "/me",
  authenticateUser,
  authControllerWithCurrentUser.getCurrentUser.bind(authController),
);

export default authRouter;