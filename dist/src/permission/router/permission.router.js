"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permission_controller_1 = require("../controller/permission.controller");
const permission_service_1 = require("../services/permission.service");
const router = express_1.default.Router();
const permissionService = new permission_service_1.PermissionService(); // Instanciando o serviço
const permissionController = new permission_controller_1.PermissionController(permissionService);
/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Admin"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-07-11T08:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-07-11T08:00:00Z"
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-07-11T08:00:00Z"
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Permission not found"
 *     Invalid:
 *       description: Invalid data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Invalid payload provided."
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
 *       201:
 *         $ref: '#/components/responses/PermissionResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", permissionController.createPermission.bind(permissionController));
/**
 * @swagger
 * /permissions/:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: A list of Permission objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       404:
 *         $ref: '#/components/responses/NotFound'
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", permissionController.getPermissionById.bind(permissionController));
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", permissionController.updatePermission.bind(permissionController));
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", permissionController.deletePermission.bind(permissionController));
exports.default = router;
