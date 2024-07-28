"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentStatus_controller_1 = require("../controller/paymentStatus.controller");
const paymentStatus_service_1 = require("../services/paymentStatus.service");
const router = express_1.default.Router();
const paymentStatusService = new paymentStatus_service_1.PaymentStatusService();
const paymentStatusController = new paymentStatus_controller_1.PaymentStatusController(paymentStatusService);
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentStatus:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Paid"
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Payment status not found"
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
 * tags:
 *   name: PaymentStatus
 *   description: Create, read, update, and delete payment statuses
 */
// Create a new payment status
/**
 * @swagger
 * /paymentstatus/create:
 *   post:
 *     summary: Create a new payment status
 *     tags: [PaymentStatus]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentStatusBody'
 *     responses:
 *       201:
 *         description: Created PaymentStatus object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatus'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", (req, res) => paymentStatusController.createPaymentStatus(req, res));
// Get all payment statuses
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/", (req, res) => paymentStatusController.getAllPaymentStatuses(req, res));
// Get a payment status by ID
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
 *         description: Retrieved PaymentStatus object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatus'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => paymentStatusController.getPaymentStatusById(req, res));
// Update a payment status by ID
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
 *         description: Updated PaymentStatus object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatus'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put("/:id", (req, res) => paymentStatusController.updatePaymentStatus(req, res));
// Delete a payment status by ID
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
router.delete("/:id", (req, res) => paymentStatusController.deletePaymentStatus(req, res));
exports.default = router;
