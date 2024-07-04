import express from "express";
import { ReportController } from "../controller/report.controller";
import { ReportService } from "../services/report.service";

const router = express.Router();
const reportService = new ReportService(); // Instanciando o serviço
const reportController = new ReportController(reportService);

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Get reports on orders
 */

/**
 * @swagger
 * /report:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get all unfinished orders
 *     responses:
 *       200:
 *         description: A list of unfinished orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 123
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: "unfinished"
 *       404:
 *         description: Orders not found
 *       400:
 *         description: Invalid request
 */
router.get("/", (req, res) =>
  reportController.getAllUnfinishedOrders(req, res),
);

/**
 * @swagger
 * /report/{userId}:
 *   get:
 *     tags:
 *       - Report
 *     summary: Get orders by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve orders for
 *     responses:
 *       200:
 *         description: A list of orders for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 123
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: "unfinished"
 *       404:
 *         description: Orders not found
 *       400:
 *         description: Invalid request
 */
router.get("/:userId", (req, res) =>
  reportController.getOrderByUserId(req, res),
);

export default router;
