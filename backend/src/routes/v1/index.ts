import { Router } from "express";
import { env } from "../../config/env";
import healthRoutes from "./health";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to PulseRoute API",
    data: {
      name: env.APP_NAME,
      version: env.APP_VERSION,
      environment: env.NODE_ENV
    }
  });
});

router.use("/health", healthRoutes);

export default router;