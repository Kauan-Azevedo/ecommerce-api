import express from "express";
import { UsersController } from "../controller/user.controller";
import { UsersService } from "../services/user.service";

const router = express.Router();
const userService = new UsersService();
const userController = new UsersController(userService);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - id_permission
 *       properties:
 *         first_name:
 *           type: string
 *           example: John
 *         last_name:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         phone_number:
 *           type: string
 *           example: "123-456-7890"
 *         password:
 *           type: string
 *           example: password123
 *         confirm_password:
 *           type: string
 *           example: password123
 *         id_permission:
 *           type: integer
 *           example: 1
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
 * /users/create:
 *   post:
 *     summary: Create a new User
 *     tags: [User]
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", userController.createUser.bind(userController));


/**
 * @swagger
 * /users/createAdmin:
 *   post:
 *     summary: Create a new Admin User
 *     tags: [User]
 *     requestBody:
 *       $ref: '#/components/requestBodies/UserBody'
 *     responses:
 *       201:
 *         $ref: '#/components/responses/UserResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/createAdmin", userController.createAdmin.bind(userController));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
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
 *     summary: Get all users
 *     tags: [User]
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
 *     summary: Update a user by ID
 *     tags: [User]
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
 *     summary: Delete a user by ID
 *     tags: [User]
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
