import { Router } from "express";
import { ProjectController } from "./project.controller";
import { authenticate } from "../auth/auth.middleware";
import apiKeyRouter from "../apikeys/apikey.routes";

const router = Router();
const controller = new ProjectController();

/**
 * POST /projects
 */
router.post(
  "/",
  authenticate,
  controller.createProject.bind(controller),
);

/**
 * GET /projects
 */
router.get(
  "/",
  authenticate,
  controller.getProjects.bind(controller),
);

router.get(
  "/:id",
  authenticate,
  controller.getProjectById.bind(controller),
);

/**
 * PATCH /projects/:id
 */
router.patch(
  "/:id",
  authenticate,
  controller.updateProject.bind(controller),
);
router.delete(
  "/:id",
  authenticate,
  controller.deleteProject.bind(controller),
);

router.use(
  "/:projectId/apikeys",
  apiKeyRouter,
);
export default router;