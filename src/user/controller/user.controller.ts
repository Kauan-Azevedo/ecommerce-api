import { Request, Response } from "express";
import { UsersService } from "../services/user.service";
import { Authenticated } from "@/utils/auth.decorator";

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authenticated("Admin")
  async createUser(req: Request, res: Response) {
    const user = await this.usersService.createUser(req.body);
    res.json(user);
  }

  @Authenticated("Admin")
  async getUserById(req: Request, res: Response) {
    const user = await this.usersService.getUserById(Number(req.params.id));
    res.json(user);
  }

  @Authenticated("Admin")
  async updateUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const user = await this.usersService.updateUser(userId, req.body);
    res.json(user);
  }

  @Authenticated("Default")
  async getAllUsers(req: Request, res: Response) {
    const users = await this.usersService.getAllUsers();
    res.json(users);
  }

  @Authenticated("Admin")
  async deleteUser(req: Request, res: Response) {
    const userId = Number(req.params.id);
    await this.usersService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  }
}

export { UsersController };
