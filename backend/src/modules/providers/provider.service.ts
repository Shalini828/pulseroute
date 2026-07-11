import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import { ProviderHealthService } from "../gateway/providers/provider.health";
import { CreateProviderRequest } from "./provider.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * Service responsible for provider operations.
 */
export class ProviderService {
  private readonly healthService = new ProviderHealthService();

  /**
   * Returns all configured gateway providers.
   */
  public getProviders() {
    return this.healthService.getProviders();
  }

  /**
   * Creates a provider for a project.
   */
  /**
 * Creates a provider for a project.
 */
public async createProvider(
  userId: string,
  projectId: string,
  request: CreateProviderRequest,
) {
  console.log("========== CREATE PROVIDER ==========");
  console.log("projectId:", projectId);
  console.log("userId:", userId);

  console.log("projectId from URL:", projectId);
  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });

  console.log("Project from DB:", project);

  if (!project) {
    throw new Error("Project not found.");
  }

  const provider = await prisma.provider.create({
    data: {
      name: request.name,
      baseUrl: request.baseUrl,
      priority: request.priority,
      projectId,
    },
  });

  console.log("provider created:", provider);

  return provider;
}
}