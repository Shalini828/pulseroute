import { Router } from "express";
import { jobController } from "./job.controller";

const router = Router();

/**
 * @swagger
 * /queue/{id}:
 *   get:
 *     summary: Get job status by ID
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *       404:
 *         description: Job not found
 */

router.get("/", jobController.getAllJobs.bind(jobController));
router.get("/:id", jobController.getJob.bind(jobController));

export default router;