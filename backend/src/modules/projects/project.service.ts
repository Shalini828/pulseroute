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

export class ProjectService {
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

  public async getProjects(
    userId: string,
  ): Promise<ProjectResponse[]> {
    return prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

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

  public async updateProject(
    id: string,
    userId: string,
    request: UpdateProjectRequest,
  ): Promise<ProjectResponse> {
    const project = await this.getProjectById(id, userId);

    return prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        name: request.name,
        description: request.description,
      },
    });
  }

  public async deleteProject(
    id: string,
    userId: string,
  ): Promise<void> {
    const project = await this.getProjectById(id, userId);

    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });
  }
}

export const projectService = new ProjectService();