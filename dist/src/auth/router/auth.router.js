"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_service_1 = require("../services/auth.service");
const router = express_1.default.Router();
const authService = new auth_service_1.AuthService();
const authController = new auth_controller_1.AuthController(authService);
/**
 * @swagger
 * components:
 *   requestBodies:
 *     AuthBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *   responses:
 *     AuthResponse:
 *       description: A auth object
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 */
/**
 * @swagger
 *  /auth/login:
 *    post:
 *      summary: Log in a user
 *      tags: [Auth]
 *      requestBody:
 *        $ref: '#/components/requestBodies/AuthBody'
 *      responses:
 *        200:
 *          $ref: '#/components/responses/AuthResponse'
 *        401:
 *          $ref: '#/components/responses/Invalid'
 */
router.post("/login", authController.login.bind(authController));
exports.default = router;
