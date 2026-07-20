import { Router } from "express";
import { projectController } from "./project.controller";
import { authenticate } from "../auth/auth.middleware";
import apiKeyRouter from "../apikeys/apikey.routes";

const router = Router();

router.post(
  "/",
  authenticate,
  projectController.createProject.bind(projectController),
);

router.get(
  "/",
  authenticate,
  projectController.getProjects.bind(projectController),
);

router.get(
  "/:id",
  authenticate,
  projectController.getProjectById.bind(projectController),
);

router.patch(
  "/:id",
  authenticate,
  projectController.updateProject.bind(projectController),
);

router.delete(
  "/:id",
  authenticate,
  projectController.deleteProject.bind(projectController),
);

router.use(
  "/:projectId/apikeys",
  apiKeyRouter,
);

export default router;