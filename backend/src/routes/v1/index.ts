import { Router } from "express";
import healthRouter from "./health";
import gatewayRouter from "../../modules/gateway/gateway.route";
import providerRouter from "../../modules/providers/provider.route";
import metricsRouter from "../../modules/metrics/metrics.route";
import logsRouter from "../../modules/logs/logs.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/gateway", gatewayRouter);
router.use("/metrics", metricsRouter);
router.use("/providers", providerRouter);
router.use("/logs", logsRouter);

export default router;