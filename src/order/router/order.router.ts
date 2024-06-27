import express from "express"
import { OrderService } from "../services/order.service"
import { OrderController } from "../controller/order.controller"

const router = express.Router()
const orderService = new OrderService()
const orderController = new OrderController(orderService)

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         paymentMethodId:
 *           type: integer
 *           example: 1
 *         paymentStatusId:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Order description"
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *   requestBodies:
 *     OrderBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *   responses:
 *     OrderResponse:
 *       description: An Order object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     NotFound:
 *       description: The Order was not found
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     requestBody:
 *       $ref: '#/components/requestBodies/OrderBody'
 *     responses:
 *       200:
 *         description: Successfully created an order
 *         $ref: '#/components/responses/OrderResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", (req, res) => orderController.createOrder(req, res));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order
 *         $ref: '#/components/responses/OrderResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => orderController.getOrderById(req, res));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       $ref: '#/components/requestBodies/OrderBody'
 *     responses:
 *       200:
 *         description: Updated order
 *         $ref: '#/components/responses/OrderResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put("/:id", (req, res) => orderController.updateOrder(req, res));

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => orderController.deleteOrder(req, res));
export default router