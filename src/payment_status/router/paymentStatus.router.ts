import express from "express"
import { PaymentStatusController } from "../controller/paymentStatus.controller"
import { PaymentStatusService } from "../services/paymentStatus.service"

const router = express.Router()
const paymentStatusService = new PaymentStatusService()
const paymentStatusController = new PaymentStatusController(paymentStatusService)

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentStatus:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Paid"
 *   requestBodies:
 *     PaymentStatusBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatus'
 *   responses:
 *     PaymentStatusResponse:
 *       description: A PaymentStatus object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatus'
 *     NotFound:
 *       description: The PaymentStatus was not found
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * tags:
 *   name: PaymentStatus
 *   description: Create, read, update, and delete the PaymentStatus
 */

//Post routes
/**
 * @swagger
 * /paymentstatus/create:
 *   post:
 *     summary: Create a new payment status
 *     tags: [PaymentStatus]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentStatusBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaymentStatusResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", (req, res) => paymentStatusController.createPaymentStatus(req, res))

//Get routes
/**
 * @swagger
 * /paymentstatus/:
 *   get:
 *     summary: Get all payment statuses
 *     tags: [PaymentStatus]
 *     responses:
 *       200:
 *         description: List of all payment statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentStatus'
 */
router.get("/", (req, res) => paymentStatusController.getAllPaymentStatuses(req, res))

/**
 * @swagger
 * /paymentstatus/{id}:
 *   get:
 *     summary: Get a payment status by ID
 *     tags: [PaymentStatus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment status ID
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaymentStatusResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => paymentStatusController.getPaymentStatusById(req, res))

//Put routes
/**
 * @swagger
 * /paymentstatus/{id}:
 *   put:
 *     summary: Update a payment status by ID
 *     tags: [PaymentStatus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment status ID
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentStatusBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaymentStatusResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put("/:id", (req, res) => paymentStatusController.updatePaymentStatus(req, res))

//Delete routes
/**
 * @swagger
 * /paymentstatus/{id}:
 *   delete:
 *     summary: Delete a payment status by ID
 *     tags: [PaymentStatus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The payment status ID
 *     responses:
 *       200:
 *         description: Payment status deleted
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => paymentStatusController.deletePaymentStatus(req, res))

export default router
