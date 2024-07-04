import express from "express";
import { PaymentMethodService } from "../services/paymentMethod.service";
import { PaymentMethodController } from "../controller/paymentMethod.controller";

const router = express.Router();
const paymentMethodService = new PaymentMethodService();
const paymentMethodController = new PaymentMethodController(
  paymentMethodService,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Credit Card"
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
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * tags:
 *   name: PaymentMethod
 *   description: Create, read, update, and delete the PaymentMethod
 */

//Post routes

/**
 * @swagger
 * /paymentmethod/create:
 *   post:
 *     summary: Create a new payment method
 *     tags: [PaymentMethod]
 *     requestBody:
 *       $ref: '#/components/requestBodies/PaymentMethodBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/PaymentMethodResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", (req, res) =>
  paymentMethodController.createPaymentMethod(req, res),
);

//Get routes

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
router.get("/", (req, res) =>
  paymentMethodController.getAllPaymentMethods(req, res),
);

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

router.get("/:id", (req, res) =>
  paymentMethodController.getPaymentMethodById(req, res),
);

//Put routes

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
 *         description: A payment method object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

router.put("/:id", (req, res) =>
  paymentMethodController.updatePaymentMethod(req, res),
);

//Delete routes

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
 *         description: A payment method object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

router.delete("/:id", (req, res) =>
  paymentMethodController.deletePaymentMethod(req, res),
);

export default router;
