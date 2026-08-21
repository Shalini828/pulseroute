import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class JobService {
  async createJob(prompt: string, provider?: string, projectId?: string) {
    return prisma.asyncJob.create({
      data: {
        prompt,
        provider,
        projectId,
      },
    });
  }

  async getAllJobs() {
    return prisma.asyncJob.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateJob(
    id: string,
    data: {
      status?: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
      response?: string;
      error?: string;
      provider?: string;
      latency?: number;
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
      startedAt?: Date;
      completedAt?: Date;
    },
  ) {
    return prisma.asyncJob.update({
      where: { id },
      data,
    });
  }
async getJob(id: string) {
  console.log("🔎 REQUESTED JOB ID:", id);

  const allJobs = await prisma.asyncJob.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      status: true,
      provider: true,
      createdAt: true,
    },
  });

  console.log("🔎 LATEST JOBS IN THIS DATABASE:");
  console.log(allJobs);

  const job = await prisma.asyncJob.findUnique({
    where: { id },
  });

  console.log("🔎 EXACT JOB RESULT:", job);

  return job;
}
}

export const jobService = new JobService();
