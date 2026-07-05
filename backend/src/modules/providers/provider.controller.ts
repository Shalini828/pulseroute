import type { Request, Response } from "express";
import { ProviderService } from "./provider.service";
import { ProviderInfo } from "../gateway/providers/provider.types";

/**
 * Handles HTTP requests for provider-related operations.
 */
export class ProviderController {
  constructor(private readonly providerService = new ProviderService()) {}

  /**
   * Returns all configured providers.
   */
  public getProviders(
    _req: Request,
    res: Response,
  ): Response<{ success: true; providers: ProviderInfo[] }> {
    const providers = this.providerService.getProviders();

    return res.status(200).json({
      success: true,
      providers,
    });
  }
}
