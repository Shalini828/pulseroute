import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import { redisClient } from "../../redis/redis.client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export interface ServiceHealth {
  name: string;
  status: "healthy" | "warning" | "unhealthy";
  responseTime?: number;
  message?: string;
}

export interface SystemHealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  services: ServiceHealth[];
}

export class SystemService {
  public async getSystemHealth(): Promise<SystemHealthResponse> {
    const startTime = Date.now();
    const services: ServiceHealth[] = [];

    // Check API Gateway (self)
    services.push({
      name: "API Gateway",
      status: "healthy",
      responseTime: 1,
      message: "Gateway is operational",
    });

    // Check Database
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbTime = Date.now() - dbStart;
      services.push({
        name: "Database",
        status: dbTime < 1000 ? "healthy" : "warning",
        responseTime: dbTime,
        message: dbTime < 1000 ? "Connected" : "Slow response",
      });
    } catch (error) {
      services.push({
        name: "Database",
        status: "unhealthy",
        message: "Connection failed",
      });
    }

    // Check Redis
    try {
      const redisStart = Date.now();
      await redisClient.ping();
      const redisTime = Date.now() - redisStart;
      services.push({
        name: "Cache (Redis)",
        status: redisTime < 500 ? "healthy" : "warning",
        responseTime: redisTime,
        message: redisTime < 500 ? "Connected" : "Slow response",
      });
    } catch (error) {
      services.push({
        name: "Cache (Redis)",
        status: "unhealthy",
        message: "Connection failed",
      });
    }

    // Check Providers (count active)
    try {
      const activeProviders = await prisma.provider.count({
        where: { enabled: true },
      });
      const status = activeProviders > 0 ? "healthy" : "warning";
      services.push({
        name: "Providers",
        status,
        message: `${activeProviders} active provider(s)`,
      });
    } catch (error) {
      services.push({
        name: "Providers",
        status: "unhealthy",
        message: "Unable to fetch provider status",
      });
    }

    // Determine overall status
    const unhealthyCount = services.filter(
      (s) => s.status === "unhealthy",
    ).length;
    const warningCount = services.filter((s) => s.status === "warning").length;

    let overallStatus: "healthy" | "degraded" | "unhealthy";
    if (unhealthyCount > 0) {
      overallStatus = "unhealthy";
    } else if (warningCount > 0) {
      overallStatus = "degraded";
    } else {
      overallStatus = "healthy";
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services,
    };
  }
}

export const systemService = new SystemService();
