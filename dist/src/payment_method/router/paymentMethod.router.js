"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentMethod_service_1 = require("../services/paymentMethod.service");
const paymentMethod_controller_1 = require("../controller/paymentMethod.controller");
const router = express_1.default.Router();
const paymentMethodService = new paymentMethod_service_1.PaymentMethodService();
const paymentMethodController = new paymentMethod_controller_1.PaymentMethodController(paymentMethodService);
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Credit Card"
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
 *     PaymentMethodBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *   responses:
 *     PaymentMethodResponse:
 *       description: A PaymentMethod object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentMethod'
 *     NotFound:
 *       description: The PaymentMethod was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Payment method not found"
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
 *   name: PaymentMethod
 *   description: Create, read, update, and delete payment methods
 */
// Create a new payment method
/**
 * @swagger
 * /paymentmethod/create:
 *   post:
 *     summary: Create a new payment method
 *     tags: [PaymentMethod]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentMethodBody'
 *     responses:
 *       201:
 *         description: Created PaymentMethod object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", (req, res) => paymentMethodController.createPaymentMethod(req, res));
// Get all payment methods
/**
 * @swagger
 * /paymentmethod/:
 *   get:
 *     summary: Get all payment methods
 *     tags: [PaymentMethod]
 *     responses:
 *       200:
 *         description: An array of payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 */
router.get("/", (req, res) => paymentMethodController.getAllPaymentMethods(req, res));
// Get payment method by ID
/**
 * @swagger
 * /paymentmethod/{id}:
 *   get:
 *     summary: Get payment method by ID
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the payment method
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A payment method object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => paymentMethodController.getPaymentMethodById(req, res));
// Update a payment method by ID
/**
 * @swagger
 * /paymentmethod/{id}:
 *   put:
 *     summary: Update a payment method by ID
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the payment method
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentMethodBody'
 *     responses:
 *       200:
 *         description: Updated payment method object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put("/:id", (req, res) => paymentMethodController.updatePaymentMethod(req, res));
// Delete a payment method by ID
/**
 * @swagger
 * /paymentmethod/{id}:
 *   delete:
 *     summary: Delete a payment method by ID
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the payment method
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted payment method object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => paymentMethodController.deletePaymentMethod(req, res));
exports.default = router;
