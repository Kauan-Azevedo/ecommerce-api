import express from "express"
import { StatusController } from "../controller/status.controller"
import { StatusService } from "../services/status.service"

const router = express.Router()
const statusService = new StatusService() // Instanciando o serviço
const statusController = new StatusController(statusService)


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
 *         createdAt: '2024-01-01T00:00:00.000Z'
 *         updatedAt: '2024-01-01T00:00:00.000Z'
 *         deletedAt: null
 */

/**
 * @swagger
 * tags:
 *   name: Statuses
 *   description: The status managing API
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
 */
router.get("/", statusController.getAll)

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
 */
router.get("/:id", statusController.getById)

/**
 * @swagger
 * /status:
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
 *       500:
 *         description: Some server error
 */
router.post("/", statusController.create)

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
 *       404:
 *         description: The status was not found
 *       500:
 *         description: Some error happened
 */
router.put("/:id", statusController.update)

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
 *       404:
 *         description: The status was not found
 */
router.delete("/:id", statusController.delete)

export default router