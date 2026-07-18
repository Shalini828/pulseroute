import { ProviderFactory } from "./provider.factory";

export class FailoverService {
  constructor(private readonly providerFactory: ProviderFactory) {}

  public async generate(providers: string[], prompt: string): Promise<string> {
    let lastError: unknown;

    for (const providerName of providers) {
      try {
        const provider = this.providerFactory.getProvider(providerName);

        console.log(`Trying provider: ${providerName}`);

        const response = await provider.generate({
          prompt,
        });

        return response.text;
      } catch (error) {
        console.error(`Provider ${providerName} failed.`);
        lastError = error;
      }
    }

    throw lastError ?? new Error("All providers failed.");
  }
}
