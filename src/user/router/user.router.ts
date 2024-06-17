import express from "express";
import { UsersController } from "../controller/user.controller";
import { UsersService } from "../services/user.service";

const router = express.Router();
const userService = new UsersService(); // Instanciando o serviço
const userController = new UsersController(userService);

// Your routes here
router.post("/", userController.createUser.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.get("/", userController.getAllUsers.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
