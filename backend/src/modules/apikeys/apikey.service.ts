import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import crypto from "crypto";
import { CreateApiKeyRequest } from "./apikey.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export class ApiKeyService {
  /**
   * Generates a secure API key.
   */
  private generateApiKey(): string {
    return "pr_live_" + crypto.randomBytes(32).toString("hex");
  }

  /**
   * Hashes the API key before storing it.
   */
  private hashApiKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  /**
   * Creates a new API key for a project.
   */
  public async createApiKey(
    userId: string,
    projectId: string,
    request: CreateApiKeyRequest,
  ) {
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    // Generate API key
    const apiKey = this.generateApiKey();

    // Hash it
    const keyHash = this.hashApiKey(apiKey);

    // Store only the hash
    const created = await prisma.apiKey.create({
      data: {
        name: request.name,
        keyHash,
        prefix: apiKey.substring(0, 15),
        projectId,
      },
    });

    // Return the plain key ONLY ONCE
    return {
      id: created.id,
      name: created.name,
      prefix: created.prefix,
      key: apiKey,
      createdAt: created.createdAt,
    };
  }

  /**
   * Returns all API keys for a project.
   */
  public async getApiKeys(
    userId: string,
    projectId: string,
  ) {
    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error("Project not found.");
    }

    // Return only metadata (never the real key)
    return prisma.apiKey.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        createdAt: true,
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
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  return prisma.apiKey.update({
    where: {
      id: apiKeyId,
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
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  await prisma.apiKey.delete({
    where: {
      id: apiKeyId,
    },
  });
}

}

export const apiKeyService = new ApiKeyService();