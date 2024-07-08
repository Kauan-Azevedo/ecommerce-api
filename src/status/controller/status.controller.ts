import { Prisma } from "@prisma/client";
import { StatusService } from "../services/status.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { Request, Response, NextFunction } from "express";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";


class StatusController {
  constructor(private readonly statusService: StatusService) { }

  isPayloadValid(payload: any): boolean {
    if (!payload.name) {
      return false;
    }

    return true;
  }

  async getAll(req: Request, res: Response) {
    try {
      const data = await this.statusService.getAll();

      if (!data || data.length === 0) {
        throw new PrismaError404("No statuses found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.statusService.getById(id);

      if (!data) {
        throw new PrismaError404("Status not found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const data = await this.statusService.create(req.body);

      res.status(201).json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const id = parseInt(req.params.id);
      const data = await this.statusService.update(id, req.body);

      if (!data) {
        throw new PrismaError404("Status not found");
      }

      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.statusService.delete(id);

      if (!data) {
        throw new PrismaError404("Status not found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  statusErrorHandler(
    error: any,
    req: Request,
    res: Response,
    NextFunction: NextFunction,
  ) {
    if (error instanceof PrismaHttpError) {
      return res.status(error.code).json({ error: error.message });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.meta) {
      if (
        error.meta.cause === "Record to update not found." ||
        error.meta.cause === "Record to delete does not exist."
      ) {
        return res.status(404).json({ error: "Status not found" });
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      return NextFunction();
    }

    res.status(400).json({ error: error.message });
  }
}

export { StatusController };
