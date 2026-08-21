import type { Request, Response } from "express";
import { projectService } from "./project.service";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "./project.types";

export class ProjectController {
  public async createProject(
    req: Request<unknown, unknown, CreateProjectRequest>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const project = await projectService.createProject(
      req.user.userId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  }

  public async getProjects(req: Request, res: Response): Promise<Response> {
    console.log("Authorization Header:", req.headers.authorization);
    console.log("Authenticated User:", req.user);
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const projects = await projectService.getProjects(req.user.userId);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  }

  public async getProjectById(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const project = await projectService.getProjectById(
      req.params.id,
      req.user.userId,
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  }

  public async updateProject(
    req: Request<{ id: string }, unknown, UpdateProjectRequest>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const project = await projectService.updateProject(
      req.params.id,
      req.user.userId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  }

  public async deleteProject(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    await projectService.deleteProject(req.params.id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  }
}

export const projectController = new ProjectController();
