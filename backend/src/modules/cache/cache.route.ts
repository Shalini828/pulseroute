import { Router } from "express";
import { cacheController } from "./cache.controller";

const cacheRouter = Router();

cacheRouter.get(
  "/stats",
  cacheController.getStats.bind(cacheController),
);

export default cacheRouter;