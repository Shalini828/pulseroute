import { Request, Response } from "express";
import { jobService } from "./job.service";

export class JobController {
  async getJob(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const job = await jobService.getJob(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        provider: job.provider,
        prompt: job.prompt,
        response: job.response,
        error: job.error,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      },
    });
  }

  async getAllJobs(req: Request, res: Response) {
  const jobs = await jobService.getAllJobs();

  return res.json({
    success: true,
    data: jobs,
  });
}

}

export const jobController = new JobController();
