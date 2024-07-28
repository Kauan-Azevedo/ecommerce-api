"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controller/report.controller");
const report_service_1 = require("../services/report.service");
const router = express_1.default.Router();
const reportService = new report_service_1.ReportService(); // Instanciando o serviço
const reportController = new report_controller_1.ReportController(reportService);
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
router.get("/", (req, res) => reportController.getAllUnfinishedOrders(req, res));
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
router.get("/:userId", (req, res) => reportController.getOrderByUserId(req, res));
exports.default = router;
