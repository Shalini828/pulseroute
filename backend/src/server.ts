import app from "./app";
import { env } from "./config/env";
import { logger } from "./shared/logger/logger";

app.listen(env.PORT, () => {
  logger.info(`🚀 PulseRoute running on http://localhost:${env.PORT}`);
});
