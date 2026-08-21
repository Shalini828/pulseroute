import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import {
  AnalyticsOverview,
  ProviderAnalytics,
  DailyAnalytics,
  RecentRequest,
} from "./analytics.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class AnalyticsService {
  // =========================================================
  // OVERVIEW
  // =========================================================
  public async getOverview(): Promise<AnalyticsOverview> {
    const totalRequests = await prisma.gatewayRequest.count();

    const successfulRequests = await prisma.gatewayRequest.count({
      where: {
        success: true,
      },
    });
    const failedRequests = await prisma.gatewayRequest.count({
      where: {
        success: false,
      },
    });

    const average = await prisma.gatewayRequest.aggregate({
      _avg: {
        responseTime: true,
      },
    });

    const activeProviders = await prisma.provider.count({
      where: {
        enabled: true,
      },
    });

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: average._avg.responseTime ?? 0,
      activeProviders,
    };
  }

  // =========================================================
  // PROVIDER ANALYTICS
  // =========================================================
  public async getProviderAnalytics(): Promise<ProviderAnalytics[]> {
    const requests = await prisma.gatewayRequest.findMany({
      select: {
        provider: true,
        success: true,
        responseTime: true,
      },
    });

    const providerMap = new Map<string, ProviderAnalytics>();

    for (const request of requests) {
      const provider = request.provider;

      if (!providerMap.has(provider)) {
        providerMap.set(provider, {
          provider,
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0,
          successRate: 0,
        });
      }

      const stats = providerMap.get(provider)!;

      stats.totalRequests++;

      if (request.success) {
        stats.successfulRequests++;
      } else {
        stats.failedRequests++;
      }

      stats.averageResponseTime += request.responseTime;
    }

    for (const stats of providerMap.values()) {
      stats.averageResponseTime =
        stats.totalRequests > 0
          ? stats.averageResponseTime / stats.totalRequests
          : 0;

      stats.successRate =
        stats.totalRequests > 0
          ? (stats.successfulRequests / stats.totalRequests) * 100
          : 0;
    }

    return Array.from(providerMap.values());
  }

  // =========================================================
  // DAILY ANALYTICS
  // =========================================================
  public async getDailyAnalytics(): Promise<DailyAnalytics[]> {
    const requests = await prisma.gatewayRequest.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // -------------------------------------------------------
    // Count requests for each calendar date
    // -------------------------------------------------------
    const dailyMap = new Map<string, number>();

    for (const request of requests) {
      const date = request.createdAt.toISOString().split("T")[0];

      dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1);
    }

    // -------------------------------------------------------
    // Generate the last 30 calendar days
    // -------------------------------------------------------
    const result: DailyAnalytics[] = [];

    const today = new Date();

    // Normalize to midnight
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);

    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      const year = currentDate.getFullYear();

      const month = String(currentDate.getMonth() + 1).padStart(2, "0");

      const day = String(currentDate.getDate()).padStart(2, "0");

      const date = `${year}-${month}-${day}`;

      result.push({
        date,
        requests: dailyMap.get(date) ?? 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  // =========================================================
  // RECENT REQUESTS
  // =========================================================
  public async getRecentRequests(): Promise<RecentRequest[]> {
    return prisma.gatewayRequest.findMany({
      select: {
        provider: true,
        prompt: true,
        responseTime: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  }

  // =========================================================
  // OPERATIONAL STATS
  // =========================================================
  public async getOperationalStats() {
    // Queue stats
    const queuedJobs = await prisma.asyncJob.count({
      where: {
        status: "QUEUED",
      },
    });

    const processingJobs = await prisma.asyncJob.count({
      where: {
        status: "PROCESSING",
      },
    });

    const failedJobs = await prisma.asyncJob.count({
      where: {
        status: "FAILED",
      },
    });

    // Logs count
    const logsCount = await prisma.log.count();

    // Projects count
    const projectsCount = await prisma.project.count();

    // Active API keys
    const apiKeysCount = await prisma.apiKey.count({
      where: {
        revoked: false,
      },
    });

    return {
      queue: {
        queued: queuedJobs,
        processing: processingJobs,
        failed: failedJobs,
        total: queuedJobs + processingJobs + failedJobs,
      },

      logs: {
        total: logsCount,
      },

      projects: {
        total: projectsCount,
      },

      apiKeys: {
        active: apiKeysCount,
      },
    };
  }
}

// =========================================================
// SINGLE SERVICE INSTANCE
// =========================================================

export const analyticsService = new AnalyticsService();
