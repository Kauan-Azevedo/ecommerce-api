"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const status_controller_1 = require("../controller/status.controller");
const status_service_1 = require("../services/status.service");
const router = express_1.default.Router();
const statusService = new status_service_1.StatusService();
const statusController = new status_controller_1.StatusController(statusService);
/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the status
 *         name:
 *           type: string
 *           description: The name of the status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the status was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the status was last updated
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the status was deleted
 *       example:
 *         id: 1
 *         name: waiting payment
 *         createdAt: "2023-07-11T14:48:00.000Z"
 *         updatedAt: "2023-07-11T14:48:00.000Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Status not found"
 */
/**
 * @swagger
 * tags:
 *   name: Statuses
 *   description: API for managing statuses
 */
/**
 * @swagger
 * /status:
 *   get:
 *     summary: Returns the list of all the statuses
 *     tags: [Statuses]
 *     responses:
 *       200:
 *         description: The list of the statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 *       404:
 *         description: No statuses found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", statusController.getAll.bind(statusController));
/**
 * @swagger
 * /status/{id}:
 *   get:
 *     summary: Get a status by id
 *     tags: [Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The status id
 *     responses:
 *       200:
 *         description: The status description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       404:
 *         description: The status was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", statusController.getById.bind(statusController));
/**
 * @swagger
 * /status/create:
 *   post:
 *     summary: Create a new status
 *     tags: [Statuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       201:
 *         description: The status was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       400:
 *         description: Invalid payload provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/create", statusController.create.bind(statusController));
/**
 * @swagger
 * /status/{id}:
 *   put:
 *     summary: Update a status by the id
 *     tags: [Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The status id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       200:
 *         description: The status was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       400:
 *         description: Invalid payload provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: The status was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", statusController.update.bind(statusController));
/**
 * @swagger
 * /status/{id}:
 *   delete:
 *     summary: Remove the status by id
 *     tags: [Statuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The status id
 *     responses:
 *       200:
 *         description: The status was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       404:
 *         description: The status was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", statusController.delete.bind(statusController));
exports.default = router;
