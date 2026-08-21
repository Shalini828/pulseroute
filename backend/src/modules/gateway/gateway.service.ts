import { GatewayRequest } from "./gateway.types";
import { RoutingService } from "../routing/routing.service";
import { cacheService } from "../cache/cache.service";
import { rateLimitService } from "../rate-limit/rate-limit.service";
import { addGatewayJob } from "../queue/queue";
import { prisma } from "../../lib/prisma";
import { ProviderFactory } from "./providers/provider.factory";

export class GatewayService {
  private readonly routingService = new RoutingService();
  private readonly providerFactory = new ProviderFactory();

  public async processRequest(
    request: GatewayRequest,
    projectId: string,
    userId?: string,
  ) {
    const start = Date.now();

    const prompt = request.payload.messages.at(-1)?.content ?? "";

    const clientId = userId ?? "anonymous";

    const rateLimit = await rateLimitService.check(clientId);

    if (!rateLimit.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`,
      );
    }

    const cacheKey = prompt.trim().toLowerCase();

    const cachedResponse = await cacheService.get(cacheKey);

    if (cachedResponse) {
      console.log("⚡ Returning cached response");

      return {
        success: true,
        jobId: "CACHE",
        status: "COMPLETED",
        timestamp: new Date().toISOString(),
      };
    }
    try {
      const providers = await this.routingService.selectProvider(projectId);

      if (!providers || providers.length === 0) {
        throw new Error("No active AI providers available for this project.");
      }

      const providerNames = providers.map((provider) =>
        provider.name.toLowerCase(),
      );

      const selectedProvider = providerNames[0];

      console.log("🎯 Selected provider:", selectedProvider);

      const job = await addGatewayJob({
        prompt,
        provider: selectedProvider,
        messages: request.payload.messages,
        projectId,
        userId,
      });

      console.log("📦 Created gateway job:", job.id);

      // =======================================================
      // IMPORTANT
      // =======================================================
      //
      // Do NOT:
      //
      // - create gatewayRequest here
      // - record success here
      // - record provider metrics here
      // - log SUCCESS here
      //
      // The BullMQ worker performs the actual AI request.
      // The worker is responsible for:
      //
      // 1. Calling provider
      // 2. Measuring actual latency
      // 3. Saving gatewayRequest
      // 4. Updating asyncJob
      // 5. Recording success/failure
      //
      // =======================================================

      const queueTime = Date.now() - start;

      console.log(`⏱️ Request queued in ${queueTime} ms`);

      return {
        success: true,
        jobId: job.id,
        status: "QUEUED",
        provider: selectedProvider,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const responseTime = Date.now() - start;

      const message =
        error instanceof Error ? error.message : "Unknown error occurred.";

      console.error("❌ Failed to queue gateway request:", message);

      throw error;
    }
  }

  public async processStreamRequest(
    request: GatewayRequest,
    projectId: string,
    userId: string,
    onChunk: (chunk: string) => void,
  ) {
    const start = Date.now();

    const providers = await this.routingService.selectProvider(projectId);

    if (!providers || providers.length === 0) {
      throw new Error("No active AI providers available for this project.");
    }

    const selectedProvider = providers[0].name.trim().toLowerCase();

    console.log("🎯 Streaming provider:", selectedProvider);

    const provider = this.providerFactory.getProvider(selectedProvider);

    const result = await provider.generateStream(
      {
        messages: request.payload.messages,
        model: request.payload.model,
        temperature: request.payload.temperature,
        maxTokens: request.payload.maxTokens,
        stream: true,
      },
      onChunk,
    );

    const latency = Date.now() - start;

    const prompt = request.payload.messages.at(-1)?.content ?? "";

    // Save completed streaming request
    await prisma.gatewayRequest.create({
      data: {
        endpoint: "/chat/completions",
        provider: selectedProvider,
        model: request.payload.model ?? provider.metadata.defaultModel,
        prompt,
        response: result.text,
        success: true,
        responseTime: latency,
        projectId,
        userId,
      },
    });

    console.log(`✅ Streaming request completed in ${latency} ms`);

    return {
     provider: selectedProvider,
      response: result.text,
      latency,
    };
  }

  public async getHistory(userId: string) {
    return prisma.gatewayRequest.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        provider: true,
        prompt: true,
        response: true,
        responseTime: true,
        createdAt: true,
      },
    });
  }
}

export const gatewayService = new GatewayService();
