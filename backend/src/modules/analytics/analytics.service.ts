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

  public async getOverview(): Promise<AnalyticsOverview> {
  const totalRequests = await prisma.gatewayRequest.count();

  const successfulRequests = await prisma.gatewayRequest.count({
    where: {
      response: {
        not: "",
      },
    },
  });

  const failedRequests = totalRequests - successfulRequests;

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

public async getProviderAnalytics(): Promise<ProviderAnalytics[]> {
  const requests = await prisma.gatewayRequest.findMany({
    select: {
      provider: true,
      response: true,
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

    if (request.response && request.response.trim() !== "") {
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

public async getDailyAnalytics(): Promise<DailyAnalytics[]> {
  const requests = await prisma.gatewayRequest.findMany({
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const dailyMap = new Map<string, number>();

  for (const request of requests) {
    const date = request.createdAt.toISOString().split("T")[0];

    dailyMap.set(
      date,
      (dailyMap.get(date) ?? 0) + 1,
    );
  }

  return Array.from(dailyMap.entries()).map(
    ([date, requests]) => ({
      date,
      requests,
    }),
  );
}

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

}

export const analyticsService = new AnalyticsService();