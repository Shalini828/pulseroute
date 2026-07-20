import type { ApiKey, Project } from "../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };

      project?: Project;
      apiKey?: ApiKey;
    }
  }
}

export {};