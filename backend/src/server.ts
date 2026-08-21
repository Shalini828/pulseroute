import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { env } from "./config/env";
import { logger } from "./shared/logger/logger";
import { redisClient } from "./redis/redis.client";
import { setSocketIO } from "./socket";
import "./modules/queue/worker";

export const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

setSocketIO(io);

async function startServer() {
  try {
    await redisClient.connect();
    logger.info("✅ Redis connected");

    httpServer.listen(env.PORT, () => {
      logger.info(
        `🚀 PulseRoute running on http://localhost:${env.PORT}`,
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();