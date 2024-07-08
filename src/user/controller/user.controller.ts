import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/user.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { Authenticated } from "@/utils/auth.decorator";
import { Prisma } from "@prisma/client";
import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";

class UsersController {
  constructor(private readonly usersService: UsersService) { }

  isEmailValid(email: string): boolean {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

  validatePayload(req: Request): boolean {
    const { email, password, id_permission, first_name, last_name, } = req.body;

    if (!email || !password || !id_permission || email === "" || password === "" || id_permission <= 0 || first_name === "" || last_name === "" || typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof id_permission !== "number") {
      return false
    }
    return true
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      if (!this.validatePayload(req)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      if (!this.isEmailValid(req.body.email as string)) {
        throw new PrismaError400("Invalid Email.");
      }

      if (req.body.password !== req.body.confirm_password) {
        throw new PrismaError400("Password confirmation don't match.");
      }

      const adminID = await this.usersService.getAdminPermission();

      if (adminID) {
        if (req.body.id_permission === adminID.id) {
          throw new PrismaError400("Can't create an Admin user");
        }
      }

      const user = await this.usersService.createUser(req.body);

      res.status(201).json(user);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated(["Admin"])
  async createAdmin(req: Request, res: Response): Promise<void> {
    try {
      if (!this.validatePayload(req)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      if (!this.isEmailValid(req.body.email as string)) {
        throw new PrismaError400("Invalid Email.");
      }

      const user = await this.usersService.createAdmin(req.body);
      res.status(201).json(user);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated(["Admin", "Seller", "User"])
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersService.getUserById(userId);

      if (!user) {
        throw new PrismaError404("User not found");
      }

      res.status(200).json(user);

    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated(["Admin"])
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      if (!this.validatePayload(req)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      if (!this.isEmailValid(req.body.email as string)) {
        throw new PrismaError400("Invalid Email.");
      }

      const userId = Number(req.params.id);
      const user = await this.usersService.updateUser(userId, req.body);

      if (!user) {
        throw new PrismaError404("User not found");
      }

      res.status(200).json(user);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated(["Admin", "Seller", "User"])
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.usersService.getAllUsers();

      if (!users) {
        throw new PrismaError404("Users not found");
      }

      res.status(200).json(users);
    } catch (error) {
      this.userErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  @Authenticated(["Admin"])
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const user = await this.usersService.deleteUser(userId);

      if (!user) {
        throw new PrismaError404("User not found");
      }

      res.status(200).json(user);
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
    if (error instanceof PrismaHttpError) {
      res.status(error.code).json({ error: error.message });
      return
    }

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
