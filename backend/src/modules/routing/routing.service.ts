import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export class RoutingService {
  public async selectProvider(projectId: string): Promise<any[]> {
    console.log("Routing Project ID:", projectId);

    const providers = await prisma.provider.findMany({
      where: {
        // projectId,
        enabled: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

    console.log("Providers from DB:", providers);

    if (providers.length === 0) {
      throw new Error("No enabled providers found.");
    }

    return providers;
  }
}
