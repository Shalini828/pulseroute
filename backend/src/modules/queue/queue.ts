import { Queue } from "bullmq";
import { jobService } from "./job.service";
import type { ChatMessage } from "../gateway/providers/base.provider";

export const gatewayQueue = new Queue("gateway-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

export async function addGatewayJob(data: {
  prompt: string;
  provider?: string;
  messages: ChatMessage[];
  projectId?: string;
  userId?: string;
}) {
  // Create database job
  const job = await jobService.createJob(
    data.prompt,
    data.provider,
    data.projectId,
  );

  console.log("DB Job:", job);

  // Add job to BullMQ
  await gatewayQueue.add("gateway-request", {
    jobId: job.id,
    provider: data.provider,
    messages: data.messages,
    projectId: data.projectId,
    userId: data.userId,
  });

  console.log("Queue Job Created:", {
    jobId: job.id,
    provider: data.provider,
  });

  return job;
}