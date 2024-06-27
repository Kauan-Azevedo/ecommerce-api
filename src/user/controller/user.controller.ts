import { Request, Response } from "express";
import { UsersService } from "../services/user.service";
import { Authenticated } from "@/utils/auth.decorator";

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error creating user" });
    }
  }

  @Authenticated("Admin")
  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.usersService.getUserById(Number(req.params.id));
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "User not found" });
    }
  }

  @Authenticated("Admin")
  async updateUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersService.updateUser(userId, req.body);

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "Error updating user" });
    }
  }

  @Authenticated("Default")
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.usersService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: "Error getting users data" });
    }
  }

  @Authenticated("Admin")
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.id);
      await this.usersService.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting user" });
    }
  }
}

export { UsersController };
