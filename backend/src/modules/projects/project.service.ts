import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectResponse,
} from "./project.types";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * Handles project-related business logic.
 */
export class ProjectService {
  /**
   * Creates a new project.
   */
  public async createProject(
    userId: string,
    request: CreateProjectRequest,
  ): Promise<ProjectResponse> {
    return prisma.project.create({
      data: {
        name: request.name,
        description: request.description,
        userId,
      },
    });
  }

  /**
   * Returns all projects belonging to a user.
   */
  public async getProjects(
    userId: string,
  ): Promise<ProjectResponse[]> {
    return prisma.project.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
 * Returns a single project by ID.
 */
public async getProjectById(
  id: string,
  userId: string,
): Promise<ProjectResponse> {
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  return project;
}

  /**
   * Updates a project.
   */
  public async updateProject(
    id: string,
    userId: string,
    request: UpdateProjectRequest,
  ): Promise<ProjectResponse> {
    return prisma.project.update({
      where: { id },
      data: {
        name: request.name,
        description: request.description,
      },
    });
  }

  /**
   * Deletes a project.
   */
public async deleteProject(
  id: string,
  userId: string,
): Promise<void> {
  await prisma.project.delete({
    where: {
      id,
      userId,
    },
  });
}
}
/**
 * Shared singleton instance.
 */
export const projectService = new ProjectService();

