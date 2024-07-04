import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/user.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { Authenticated } from "@/utils/auth.decorator";
import { Prisma } from "@prisma/client";

class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.usersService.createUser(req.body);
      res.status(200).json(user);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res); // Chame o handler de erros do Prisma
      });
    }
  }

  @Authenticated("Admin")
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersService.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated("Admin")
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersService.updateUser(userId, req.body);
      res.status(200).json(user);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated("Default")
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.usersService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated("Admin")
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      await this.usersService.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  private userErrorHandler(
    error: any,
    req: Request,
    res: Response,
    NextFunction: NextFunction,
  ): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.meta) {
      if (error.meta.field_name === "User_permissionId_fkey") {
        res.status(400).json({ message: "Invalid permission ID" });
        return;
      } else if (error.meta.field_name === "User_email_key") {
        res.status(400).json({ message: "This email is already in use" });
        return;
      } else if (error.meta.field_name === "User_permissionId") {
        res.status(400).json({ message: "Invalid permission ID" });
        return;
      } else if (error.meta.field_name === "User_permissionId_fkey") {
        res.status(400).json({ message: "Invalid permission ID" });
        return;
      } else {
        NextFunction();
      }
    }

    res.status(400).json({ message: error.message || "Life snake 🔫🐍" });
  }
}

export { UsersController };
