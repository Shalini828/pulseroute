import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import { ProviderHealthService } from "../gateway/providers/provider.health";
import { CreateProviderRequest, UpdateProviderRequest } from "./provider.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class ProviderService {
  private readonly healthService = new ProviderHealthService();

  public getProviders() {
    return this.healthService.getProviders();
  }

  public async createProvider(
    userId: string,
    projectId: string,
    request: CreateProviderRequest,
  ) {
    console.log("========== CREATE PROVIDER ==========");
    console.log("User ID:", userId);
    console.log("Project ID:", projectId);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    console.log("Project:", project);

    if (!project) {
      throw new Error("Project not found.");
    }

    const provider = await prisma.provider.create({
      data: {
        name: request.name,
        baseUrl: request.baseUrl,
        priority: request.priority,
        enabled: request.enabled ?? true,
        projectId,
      },
    });

    console.log("Provider created:", provider);

    return provider;
  }

  public async getProvidersByProject(userId: string, projectId: string) {
    console.log("========== GET PROVIDERS ==========");
    console.log("User ID:", userId);
    console.log("Project ID:", projectId);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    console.log("Project:", project);

    if (!project) {
      throw new Error("Project not found.");
    }

    const providers = await prisma.provider.findMany({
      where: {
        projectId,
      },
      orderBy: {
        priority: "asc",
      },
    });

    console.log("Providers:", providers);

    return providers;
  }

  /**
   * Returns a provider by ID.
   */
  public async getProviderById(providerId: string) {
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!provider) {
      throw new Error("Provider not found.");
    }

    return provider;
  }

  public async updateProvider(
    providerId: string,
    request: UpdateProviderRequest,
  ) {
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
    });
    if (!provider) {
      throw new Error("Provider not found.");
    }

    return prisma.provider.update({
      where: {
        id: providerId,
      },
      data: {
        name: request.name,
        baseUrl: request.baseUrl,
        priority: request.priority,
        enabled: request.enabled,
      },
    });
  }

  public async deleteProvider(providerId: string) {
    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!provider) {
      throw new Error("Provider not found.");
    }
    await prisma.provider.delete({
      where: {
        id: providerId,
      },
    });
    return;
  }
}
