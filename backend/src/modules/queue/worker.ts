import { Worker } from "bullmq";
import { jobService } from "./job.service";
import { ProviderFactory } from "../gateway/providers/provider.factory";
import { ProviderHealthService } from "../gateway/providers/provider.health";
import { FallbackService } from "../gateway/providers/fallback.service";
import { FallbackGateway } from "../gateway/providers/fallback.gateway";
import { prisma } from "../../lib/prisma";

const providerFactory = new ProviderFactory();

const providerHealth = new ProviderHealthService();

const fallbackService = new FallbackService(
  providerFactory,
);

const fallbackGateway = new FallbackGateway(
  providerHealth,
  fallbackService,
);

export const gatewayWorker = new Worker(
  "gateway-queue",

  async (job) => {
    const {
      jobId,
      provider,
      messages,
      projectId,
      userId,
    } = job.data;

    console.log(
      "🚀 Processing gateway job:",
      jobId,
    );

    await jobService.updateJob(jobId, {
      status: "PROCESSING",
      startedAt: new Date(),
    });

    const startTime = Date.now();

    try {

      const result =
        await fallbackGateway.generate(
          provider ?? "gemini",
          messages,
        );

      const latency = Date.now() - startTime;

      const prompt =
        messages[messages.length - 1]?.content ?? "";

      await prisma.gatewayRequest.create({
        data: {
          endpoint: "/chat/completions",

          provider:
            result.provider || provider || "unknown",

          model: "default",

          prompt,

          response: result.text,

          success: true,

          responseTime: latency,

          promptTokens:
            result.usage?.promptTokens,

          completionTokens:
            result.usage?.completionTokens,

          totalTokens:
            result.usage?.totalTokens,

          projectId,
          userId,
        },
      });

      await jobService.updateJob(jobId, {
        status: "COMPLETED",

        response: result.text,

        provider:
          result.provider || provider,

        latency,

        completedAt: new Date(),

        promptTokens:
          result.usage?.promptTokens,

        completionTokens:
          result.usage?.completionTokens,

        totalTokens:
          result.usage?.totalTokens,
      });

      console.log(
        "✅ Job completed:",
        jobId,
        "| Provider:",
        result.provider,
        "| Latency:",
        latency,
        "ms",
      );

      // Return useful information to BullMQ
      return {
        success: true,
        provider: result.provider,
        response: result.text,
        latency,
      };
    } catch (error) {
      const latency = Date.now() - startTime;

      const message =
        error instanceof Error
          ? error.message
          : "Unknown error";

      const prompt =
        messages[messages.length - 1]?.content ?? "";

      try {
        await prisma.gatewayRequest.create({
          data: {
            endpoint: "/chat/completions",

            provider:
              provider || "unknown",

            model: "default",

            prompt,

            response: "",

            success: false,

            responseTime: latency,

            projectId,
            userId,
          },
        });
      } catch (historyError) {
        console.error(
          "❌ Failed to save request history:",
          historyError,
        );
      }

      await jobService.updateJob(jobId, {
        status: "FAILED",

        error: message,

        provider:
          provider || "unknown",

        latency,

        completedAt: new Date(),
      });

      console.error(
        "❌ Job failed:",
        jobId,
        "|",
        message,
      );

      // Important: allow BullMQ to know the job failed
      throw error;
    }
  },

  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },

    concurrency: 5,
  },
);