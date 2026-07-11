import { Router } from "express";
import healthRouter from "./health";
import gatewayRouter from "../../modules/gateway/gateway.route";
import providerRouter from "../../modules/providers/provider.route";
import metricsRouter from "../../modules/metrics/metrics.route";
import logsRouter from "../../modules/logs/logs.route";
import authRouter from "../../modules/auth/auth.routes";
import projectRouter from "../../modules/projects/project.routes";
import apiKeyRouter from "../../modules/apikeys/apikey.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/gateway", gatewayRouter);
router.use("/metrics", metricsRouter);
router.use("/providers", providerRouter);
router.use("/logs", logsRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/", apiKeyRouter);

export default router;