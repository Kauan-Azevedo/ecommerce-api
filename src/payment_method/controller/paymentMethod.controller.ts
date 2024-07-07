import { Request, Response } from "express";
import { PaymentMethodService } from "../services/paymentMethod.service";
import prismaErrorHandler from "prisma/middleware/errorHandler";
import { Prisma } from "@prisma/client";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";

export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) { }

  isValidPayload(paymentMethod: any): boolean {
    if (!paymentMethod.name || paymentMethod.name === "") {
      return false;
    }
    return true;
  }

  async createPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      if (!this.isValidPayload(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const paymentMethod = await this.paymentMethodService.createPaymentMethod(
        req.body,
      );

      res.status(201).json(paymentMethod);
    } catch (error) {
      return this.PaymentMethodErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async getPaymentMethodById(req: Request, res: Response) {
    try {
      const paymentMethod =
        await this.paymentMethodService.getPaymentMethodById(
          Number(req.params.id),
        );

      if (!paymentMethod) {
        throw new PrismaError404("Payment method not found");
      }

      res.json(paymentMethod);
    } catch (error) {
      return this.PaymentMethodErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async updatePaymentMethod(req: Request, res: Response) {
    try {
      if (!this.isValidPayload(req.body)) {
        throw new PrismaError400("Invalid payload provided.");
      }

      const methodId = Number(req.params.id);
      const paymentMethod = await this.paymentMethodService.updatePaymentMethod(
        methodId,
        req.body,
      );
      if (!paymentMethod) {
        throw new PrismaError404("Payment method not found");
      }
      return res.json(paymentMethod);
    } catch (error) {
      return this.PaymentMethodErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async getAllPaymentMethods(req: Request, res: Response) {
    try {
      const paymentMethods =
        await this.paymentMethodService.getAllPaymentMethods();

      if (paymentMethods.length === 0 || !paymentMethods) {
        throw new PrismaError404("No found any payment methods");
      }

      res.json(paymentMethods);
    } catch (error) {
      return this.PaymentMethodErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const methodId = Number(req.params.id);
      const paymentMethod =
        await this.paymentMethodService.deletePaymentMethod(methodId);

      if (!paymentMethod) {
        throw new PrismaError404("Payment method not found");
      }

      return res.json(paymentMethod);
    } catch (error) {
      return this.PaymentMethodErrorHandler(
        error,
        req,
        res,
        prismaErrorHandler,
      );
    }
  }

  PaymentMethodErrorHandler(
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
      res.status(error.code).json({ error: error.message });
      return
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error as Prisma.PrismaClientKnownRequestError;

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Payment method not found" });
      }
    }

    return next(error, req, res);
  }
}
