import { Router } from "express";
import healthRouter from "./health";
import gatewayRouter from "../../modules/gateway/gateway.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/gateway", gatewayRouter);

export default router;