import type { Request, Response } from "express";
import { ProviderService } from "./provider.service";
import type {
  CreateProviderRequest,
  UpdateProviderRequest,
} from "./provider.types";

export class ProviderController {
  constructor(
    private readonly providerService = new ProviderService(),
  ) {}

  public getProviders(_req: Request, res: Response): Response {
    const providers = this.providerService.getProviders();

    return res.status(200).json({
      success: true,
      data: providers,
    });
  }

  public async createProvider(
    req: Request<{ projectId: string }, unknown, CreateProviderRequest>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const provider = await this.providerService.createProvider(
      req.user.userId,
      req.params.projectId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Provider created successfully.",
      data: provider,
    });
  }

  public async getProvidersByProject(
    req: Request<{ projectId: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const providers = await this.providerService.getProvidersByProject(
      req.user.userId,
      req.params.projectId,
    );

    return res.status(200).json({
      success: true,
      data: providers,
    });
  }

  public async getProviderById(
    req: Request<{ projectId: string; providerId: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const provider = await this.providerService.getProviderById(
      req.user.userId,
      req.params.projectId,
      req.params.providerId,
    );

    return res.status(200).json({
      success: true,
      data: provider,
    });
  }

  public async updateProvider(
    req: Request<
      { projectId: string; providerId: string },
      unknown,
      UpdateProviderRequest
    >,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const provider = await this.providerService.updateProvider(
      req.user.userId,
      req.params.projectId,
      req.params.providerId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Provider updated successfully.",
      data: provider,
    });
  }

  public async deleteProvider(
    req: Request<{ projectId: string; providerId: string }>,
    res: Response,
  ): Promise<Response> {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    await this.providerService.deleteProvider(
      req.user.userId,
      req.params.projectId,
      req.params.providerId,
    );

    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully.",
    });
  }
  public async getAllProviders(
  _req: Request,
  res: Response,
): Promise<Response> {
  const providers = await this.providerService.getAllProviders();

  return res.status(200).json({
    success: true,
    data: providers,
  });
}
}

export const providerController = new ProviderController();