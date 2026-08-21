import { Router } from "express";
import healthRouter from "./health";
import gatewayRouter from "../../modules/gateway/gateway.route";
import providerRouter from "../../modules/providers/provider.route";
import metricsRouter from "../../modules/metrics/metrics.route";
import logsRouter from "../../modules/logs/logs.route";
import authRouter from "../../modules/auth/auth.routes";
import projectRouter from "../../modules/projects/project.routes";
import apiKeyRouter from "../../modules/apikeys/apikey.routes";
import analyticsRouter from "../../modules/analytics/analytics.route";
import cacheRouter from "../../modules/cache/cache.route";
import rateLimitRouter from "../../modules/rate-limit/rate-limit.route";
import queueRouter from "../../modules/queue/queue.route";
import jobRouter from "../../modules/queue/job.routes";
import systemRouter from "../../modules/system/system.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/system", systemRouter);
router.use("/gateway", gatewayRouter);
router.use("/analytics", analyticsRouter);
router.use("/metrics", metricsRouter);
router.use("/cache", cacheRouter);
router.use("/providers", providerRouter);
router.use("/logs", logsRouter);
router.use("/auth", authRouter);
router.use("/projects", projectRouter);
router.use("/projects/:projectId/apikeys", apiKeyRouter);
router.use("/rate-limit", rateLimitRouter);
router.use("/queue", queueRouter);
router.use("/jobs", jobRouter);

export default router;
