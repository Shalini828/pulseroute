import crypto from "crypto";
import { prisma } from "../../lib/prisma";

import {
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  ApiKeyResponse,
} from "./apikey.types";

export class ApiKeyService {
  private generateApiKey(): string {
    return "pr_live_" + crypto.randomBytes(32).toString("hex");
  }

  private hashApiKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  public async createApiKey(
    userId: string,
    projectId: string,
    request: CreateApiKeyRequest,
  ): Promise<CreateApiKeyResponse> {
    console.log("userId:", userId);
    console.log("projectId:", projectId);
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const apiKey = this.generateApiKey();

    const keyHash = this.hashApiKey(apiKey);

    const created = await prisma.apiKey.create({
      data: {
        name: request.name,
        keyHash,
        prefix: apiKey.slice(0, 12),
        project: {
          connect: {
            id: projectId,
          },
        },
      },
      include: {
        project: true,
      },
    });

    return {
      apiKey,
      key: {
        id: created.id,
        name: created.name,
        prefix: created.prefix,
        createdAt: created.createdAt,
        revoked: created.revoked,
        projectId: created.projectId,
      },
    };
  }

  public async getApiKeys(
    userId: string,
    projectId: string,
  ): Promise<ApiKeyResponse[]> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    return prisma.apiKey.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
        revoked: true,
        projectId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public async revokeApiKey(
    userId: string,
    projectId: string,
    apiKeyId: string,
  ): Promise<ApiKeyResponse> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        projectId,
      },
    });

    if (!apiKey) {
      throw new Error("API key not found.");
    }

    return prisma.apiKey.update({
      where: {
        id: apiKey.id,
      },
      data: {
        revoked: true,
      },
    });
  }

  public async deleteApiKey(
    userId: string,
    projectId: string,
    apiKeyId: string,
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

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: apiKeyId,
        projectId,
      },
    });

    if (!apiKey) {
      throw new Error("API key not found.");
    }

    await prisma.apiKey.delete({
      where: {
        id: apiKey.id,
      },
    });
  }

  public async validateApiKey(apiKey: string) {
    const keyHash = this.hashApiKey(apiKey);

    return prisma.apiKey.findFirst({
      where: {
        keyHash,
        revoked: false,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });
  }

  public async getProjectFromApiKey(apiKey: string) {
    const key = await this.validateApiKey(apiKey);

    if (!key) {
      throw new Error("Invalid API Key");
    }

    return key.project;
  }
}

export const apiKeyService = new ApiKeyService();
