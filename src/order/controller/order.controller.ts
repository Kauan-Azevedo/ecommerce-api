import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import prismaErrorHandler from "../../../prisma/middleware/errorHandler";
import { PrismaError404 } from "../../../prisma/middleware/errors/Prisma404";
import { PrismaHttpError } from "../../../prisma/middleware/errors/PrismaHttpError";
import { Prisma } from "@prisma/client";
import { OrderData } from "../interfaces/order.interfaces";

class OrderController {
  constructor(private readonly orderService: OrderService) { }
  isValidPayload(orderData: OrderData): boolean {
    if (
      !orderData.paymentMethodId ||
      !orderData.paymentStatusId ||
      !orderData.statusid ||
      !orderData.userId ||
      !orderData.orderItems
    ) {
      return false;
    }

    return true;
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////Getters//////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      const order = await this.orderService.getOrderById(orderId);
      if (order) {
        res.status(200).json(order);
      } else {
        throw new PrismaError404("Order not found");
      }
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await this.orderService.getAllOrders();

      if (orders.length === 0 || !orders) {
        throw new PrismaError404("No found any orders")
      }

      res.status(200).json(orders);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async getOrdersByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const orders = await this.orderService.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async getOrdersByPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const paymentStatusId = parseInt(req.params.id);
      const orders =
        await this.orderService.getOrdersByPaymentStatus(paymentStatusId);
      res.status(200).json(orders);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async getOrdersByPaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const paymentMethodId = parseInt(req.params.id);
      const orders =
        await this.orderService.getOrdersByPaymentMethod(paymentMethodId);
      res.status(200).json(orders);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////END OF THE GETTERS////////////////////////
  /////////////////////////////////////////////////////////////////////////

  async createOrder(req: Request, res: Response): Promise<void> {
    if (!this.isValidPayload(req.body)) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    try {
      const orderData = req.body;
      const order = await this.orderService.createOrder(orderData);
      res.status(201).json(order);
    } catch (error: any) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      const orderData = req.body;
      const order = await this.orderService.updateOrder(orderId, orderData);
      res.status(200).json(order);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id);
      const order = await this.orderService.deleteOrder(orderId);
      res.status(204).json(order);
    } catch (error) {
      this.orderErrorHandler(error, req, res, () => {
        prismaErrorHandler(error, req, res);
      });
    }
  }

  orderErrorHandler(
    error: any,
    req: Request,
    res: Response,
    NextFunction: NextFunction,
  ): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.meta) {
      if (
        error.meta.field_name == "Order_paymentMethodId_fkey (index)" ||
        error.meta.field_name == "Order_paymentStatusId_fkey (index)"
      ) {
        res.status(400).json({ error: "Invalid payment method or status" });
        return;
      }

      if (error.meta.field_name == "Order_userId_fkey (index)") {
        res.status(400).json({ error: "Invalid user" });
        return;
      }

      if (error.meta.cause === "Record to update not found.") {
        res.status(404).json({ error: "Order not found" });
        return;
      }
    }

    if (error instanceof PrismaHttpError) {
      res.status(error.code).json({ error: error.message });
      return
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

export { OrderController };
