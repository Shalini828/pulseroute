import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate as authenticateUser } from "./auth.middleware";
const authRouter = Router();

const authController = new AuthController();
const authControllerWithCurrentUser = authController as AuthController & {
  getCurrentUser: typeof authController.getUsers;
};

authRouter.post("/register", authController.register.bind(authController));

authRouter.post("/login", authController.login.bind(authController));

authRouter.get("/users", authController.getUsers.bind(authController));
authRouter.get(
  "/me",
  authenticateUser,
  authControllerWithCurrentUser.getCurrentUser.bind(authController),
);

export default authRouter;
