import express from "express";
import { UsersController } from "../controller/user.controller";
import { UsersService } from "../services/user.service";

const router = express.Router();
const userService = new UsersService(); // Instanciando o serviço
const userController = new UsersController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *   requestBodies:
 *     UserBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *   responses:
 *     UserResponse:
 *       description: A user object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     NotFound:
 *       description: The user was not found
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/", userController.createUser.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", userController.getUserById.bind(userController));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UserResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", userController.updateUser.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
