import { Request, Response } from "express";
import { PaymentStatusService } from "../services/paymentStatus.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { Prisma } from "@prisma/client";

class PaymentStatusController {
  constructor(private readonly paymentStatusService: PaymentStatusService) { }

  isPayloadValid(payload: any): boolean {
    if (!payload.name || payload.name === "") {
      return false;
    }

    return true;
  }

  async createPaymentStatus(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const paymentStatus = await this.paymentStatusService.createPaymentStatus(
        req.body,
      );
      res.status(201).json(paymentStatus);
    } catch (error) {
      return this.paymentStatusErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async getPaymentStatusById(req: Request, res: Response) {
    try {
      const paymentStatus =
        await this.paymentStatusService.getPaymentStatusById(
          Number(req.params.id),
        );

      if (!paymentStatus) {
        throw new PrismaError404("Payment status not found")
      }

      return res.json(paymentStatus);
    } catch (error) {
      this.paymentStatusErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const statusId = Number(req.params.id);
      const paymentStatus = await this.paymentStatusService.updatePaymentStatus(
        statusId,
        req.body,
      );

      if (!paymentStatus) {
        throw new PrismaError404("Payment status not found")
      }

      res.json(paymentStatus);
    } catch (error) {
      this.paymentStatusErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async getAllPaymentStatuses(req: Request, res: Response) {
    try {
      const response = await this.paymentStatusService.getAllPaymentStatuses();

      if (!response || response.length === 0) {
        throw new PrismaError404("No payment statuses found")
      }

    } catch (error) {
      this.paymentStatusErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async deletePaymentStatus(req: Request, res: Response) {
    try {
      const statusId = Number(req.params.id);

      const deleteResult =
        await this.paymentStatusService.deletePaymentStatus(statusId);

      if (!deleteResult) {
        throw new PrismaError404("Payment status not found")
      }

      res.json(deleteResult);
    } catch (error) {
      this.paymentStatusErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  paymentStatusErrorHandler(
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
        return res.status(404).json({ error: "Payment status not found" });
      }
    }

    next(error, req, res);
  }
}

export { PaymentStatusController };
