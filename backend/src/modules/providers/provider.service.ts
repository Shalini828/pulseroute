import { ProviderHealthService } from "../gateway/providers/provider.health";

/**
 * Service responsible for provider metadata retrieval.
 */
export class ProviderService {
  private readonly healthService = new ProviderHealthService();

  /**
   * Returns all configured gateway providers.
   */
  public getProviders() {
    return this.healthService.getProviders();
  }
}
