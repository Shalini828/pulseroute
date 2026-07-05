import { Router } from "express";
import healthRouter from "./health";
import gatewayRouter from "../../modules/gateway/gateway.route";
import providerRouter from "../../modules/providers/provider.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/gateway", gatewayRouter);
router.use("/providers", providerRouter);

export default router;