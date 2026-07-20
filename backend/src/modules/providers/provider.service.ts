import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import { ProviderHealthService } from "../gateway/providers/provider.health";
import type {
  CreateProviderRequest,
  UpdateProviderRequest,
  ProviderResponse,
} from "./provider.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class ProviderService {
  private readonly healthService = new ProviderHealthService();

  /**
   * Returns all supported providers.
   */
  public getProviders() {
    return this.healthService.getProviders();
  }

  /**
   * Create provider.
   */
  public async createProvider(
    userId: string,
    projectId: string,
    request: CreateProviderRequest,
  ): Promise<ProviderResponse> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const provider = await prisma.provider.create({
      data: {
        name: request.name,
        apiKey: request.apiKey,
        model: request.model,
        baseUrl: request.baseUrl,
        priority: request.priority,
        enabled: request.enabled ?? true,
        projectId,
      },
    });

    return {
      id: provider.id,
      name: provider.name,
      model: provider.model,
      baseUrl: provider.baseUrl,
      priority: provider.priority,
      enabled: provider.enabled,
      projectId: provider.projectId,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  /**
   * Get providers for a project.
   */
  public async getProvidersByProject(
    userId: string,
    projectId: string,
  ): Promise<ProviderResponse[]> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

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

    return providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      model: provider.model,
      baseUrl: provider.baseUrl,
      priority: provider.priority,
      enabled: provider.enabled,
      projectId: provider.projectId,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    }));
  }

  /**
   * Get provider by id.
   */
  public async getProviderById(
    userId: string,
    projectId: string,
    providerId: string,
  ): Promise<ProviderResponse> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const provider = await prisma.provider.findFirst({
      where: {
        id: providerId,
        projectId,
      },
    });

    if (!provider) {
      throw new Error("Provider not found.");
    }

    return {
      id: provider.id,
      name: provider.name,
      model: provider.model,
      baseUrl: provider.baseUrl,
      priority: provider.priority,
      enabled: provider.enabled,
      projectId: provider.projectId,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
    };
  }

  /**
   * Update provider.
   */
  public async updateProvider(
    userId: string,
    projectId: string,
    providerId: string,
    request: UpdateProviderRequest,
  ): Promise<ProviderResponse> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const provider = await prisma.provider.findFirst({
      where: {
        id: providerId,
        projectId,
      },
    });

    if (!provider) {
      throw new Error("Provider not found.");
    }

    const updated = await prisma.provider.update({
      where: {
        id: providerId,
      },
      data: {
        name: request.name,
        apiKey: request.apiKey,
        model: request.model,
        baseUrl: request.baseUrl,
        priority: request.priority,
        enabled: request.enabled,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      model: updated.model,
      baseUrl: updated.baseUrl,
      priority: updated.priority,
      enabled: updated.enabled,
      projectId: updated.projectId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Delete provider.
   */
  public async deleteProvider(
    userId: string,
    projectId: string,
    providerId: string,
  ): Promise<void> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const provider = await prisma.provider.findFirst({
      where: {
        id: providerId,
        projectId,
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
  }
}

export const providerService = new ProviderService();