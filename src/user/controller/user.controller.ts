import { Request, Response } from "express";
import { UsersService } from "../services/user.service";

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(req: Request, res: Response) {
    const user = await this.usersService.createUser(req.body);
    res.json(user);
  }

  async getUserById(req: Request, res: Response) {
    const user = await this.usersService.getUserById(Number(req.params.id));
    res.json(user);
  }

  async updateUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await this.usersService.updateUser(userId, req.body);
    res.json(user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.usersService.getAllUsers();
    res.json(users);
  }

  async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    await this.usersService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  }
}

export { UsersController };
