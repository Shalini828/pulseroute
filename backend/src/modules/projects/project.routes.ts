import { Router } from "express";
import { projectController } from "./project.controller";
import { authenticate } from "../auth/auth.middleware";
import apiKeyRouter from "../apikeys/apikey.routes";

const router = Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  projectController.createProject.bind(projectController),
);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get(
  "/",
  authenticate,
  projectController.getProjects.bind(projectController),
);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get(
  "/:id",
  authenticate,
  projectController.getProjectById.bind(projectController),
);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.patch(
  "/:id",
  authenticate,
  projectController.updateProject.bind(projectController),
);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
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