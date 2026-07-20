import { Router } from "express";
import { analyticsController } from "./analytics.controller";

const router = Router();

router.get(
  "/overview",
  analyticsController.getOverview.bind(
    analyticsController,
  ),
);

router.get(
  "/providers",
  analyticsController.getProviderAnalytics.bind(
    analyticsController,
  ),
);

router.get(
  "/daily",
  analyticsController.getDailyAnalytics.bind(
    analyticsController,
  ),
);

router.get(
  "/recent",
  analyticsController.getRecentRequests.bind(
    analyticsController,
  ),
);
export default router;