import express from "express";
import { PermissionController } from "../controller/permission.controller";
import { PermissionService } from "../services/permission.service";

const router = express.Router();
const permissionService = new PermissionService(); // Instanciando o serviço
const permissionController = new PermissionController(permissionService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Admin"
 *   requestBodies:
 *     PermissionBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *   responses:
 *     PermissionResponse:
 *       description: A Permission object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     NotFound:
 *       description: The Permission was not found
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * /permissions/create:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PermissionBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post(
  "/create",
  permissionController.createPermission.bind(permissionController),
);

/**
 * @swagger
 * /permissions/:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.get("/", permissionController.getPermissions.bind(permissionController));

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.get(
  "/:id",
  permissionController.getPermissionById.bind(permissionController),
);

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/requestBodies/PermissionBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put(
  "/:id",
  permissionController.updatePermission.bind(permissionController),
);

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.delete(
  "/:id",
  permissionController.deletePermission.bind(permissionController),
);
export default router;
