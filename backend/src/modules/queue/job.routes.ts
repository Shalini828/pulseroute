import { Router } from "express";
import { jobController } from "./job.controller";

const router = Router();

router.get("/:id", jobController.getJob.bind(jobController));

export default router;