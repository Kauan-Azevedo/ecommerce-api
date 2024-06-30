import { Prisma } from "@prisma/client";
import { StatusService } from "../services/status.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { Request, Response, NextFunction } from "express";

class StatusController {
  constructor(private readonly statusService: StatusService) { }

  async getAll(req: Request, res: Response) {
    try {
      const data = await this.statusService.getAll();
      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.statusService.getById(id);
      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await this.statusService.create(req.body);
      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.statusService.update(id, req.body);
      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.statusService.delete(id);
      res.json(data);
    } catch (error: any) {
      this.statusErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res)
      })
    }
  }

  statusErrorHandler(error: any, req: Request, res: Response, NextFunction: NextFunction): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.meta) {

      if (error.meta.cause === "Record to update not found.") {
        res.status(404).json({ error: 'Status not found' })
        return
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextFunction()
    }

    res.status(400).json({ error: error.message })
  }
}

export { StatusController };