import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { PermissionService } from "../services/permission.service";
import { Request, Response } from "express";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { Prisma } from "@prisma/client";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";
import prismaErrorHandler from "prisma/middleware/errorHandler";

class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  isPayloadValid(payload: any): boolean {
    if (!payload.name || payload.name === "") {
      return false;
    }

    return true;
  }

  async createPermission(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const permission = await this.permissionService.createPermission(
        req.body,
      );

      res.status(201).send(permission);
    } catch (error) {
      this.permissionErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async getPermissions(req: Request, res: Response) {
    try {
      const permissions = await this.permissionService.getPermissions();

      if (!permissions || permissions.length === 0) {
        throw new PrismaError404("Permissions not found");
      }

      res.status(200).send(permissions);
    } catch (error) {
      this.permissionErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async getPermissionById(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.getPermissionById(
        Number(req.params.id),
      );

      if (!permission) {
        throw new PrismaError404("Permission not found");
      }

      res.status(200).send(permission);
    } catch (error) {
      this.permissionErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async updatePermission(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const permission = await this.permissionService.updatePermission(
        Number(req.params.id),
        req.body,
      );

      if (!permission) {
        throw new PrismaError404("Permission not found");
      }

      res.status(200).send(permission);
    } catch (error) {
      this.permissionErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async deletePermission(req: Request, res: Response) {
    try {
      const permission = await this.permissionService.deletePermission(
        Number(req.params.id),
      );

      if (!permission) {
        throw new PrismaError404("Permission not found");
      }

      res.status(200).send(permission);
    } catch (error) {
      this.permissionErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  permissionErrorHandler(
    error: any,
    req: Request,
    res: Response,
    next: Function,
  ) {

    if (error instanceof Prisma.PrismaClientValidationError) {
      error as Prisma.PrismaClientValidationError;
      return res.status(400).json({ error: "Invalid payload provided." });
    }

    if (error instanceof PrismaHttpError) {
      return res.status(error.code).json({ error: error.message });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error as Prisma.PrismaClientKnownRequestError;

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Permission not found" });
      }
    }

    next(error, req, res);
  }
}

export { PermissionController };
