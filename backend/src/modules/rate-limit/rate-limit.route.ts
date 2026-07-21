import { Router } from "express";
import { getRateLimitStatus } from "./rate-limit.controller";

const router = Router();

router.get("/status", getRateLimitStatus);

export default router;