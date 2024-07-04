import { Request, Response } from "express";
import { PaymentMethodService } from "@/payment_method/services/paymentMethod.service";
import { PaymentMethodController } from "@/payment_method/controller/paymentMethod.controller";

import { PaymentStatusService } from "@/payment_status/services/paymentStatus.service";
import { PaymentStatusController } from "@/payment_status/controller/paymentStatus.controller";

import { Prisma } from "@prisma/client";

describe("PaymentMethodController", () => {
  let paymentMethodService: PaymentMethodService;
  let paymentMethodController: PaymentMethodController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    paymentMethodService = new PaymentMethodService();
    paymentMethodController = new PaymentMethodController(paymentMethodService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
  });

  describe("createPaymentMethod", () => {
    it("should create a new payment method", async () => {
      const paymentMethod = { id: 1, name: "Credit Card" };
      paymentMethodService.createPaymentMethod = jest
        .fn()
        .mockResolvedValue(paymentMethod);
      req.body = { name: "Credit Card" };

      await paymentMethodController.createPaymentMethod(req, res);

      expect(res.json).toHaveBeenCalledWith(paymentMethod);
    });

    it("should return 409 status code if payment method already exists", async () => {
      const existingPaymentMethod = { id: 1, name: "Credit Card" };
      paymentMethodService.createPaymentMethod = jest
        .fn()
        .mockResolvedValue(null);
      req.body = { name: "Credit Card" };

      await paymentMethodController.createPaymentMethod(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: `Payment method with name ${req.body.name} already exists.`,
      });
    });
  });

  describe("getPaymentMethodById", () => {
    it("should return a payment method by id", async () => {
      const id = 1;
      const paymentMethod = { id, name: "Credit Card" };
      paymentMethodService.getPaymentMethodById = jest
        .fn()
        .mockResolvedValue(paymentMethod);
      req.params = { id: id.toString() };

      await paymentMethodController.getPaymentMethodById(req, res);

      expect(res.json).toHaveBeenCalledWith(paymentMethod);
    });

    it("should return 404 status code if payment method not found", async () => {
      const id = 1;
      paymentMethodService.getPaymentMethodById = jest
        .fn()
        .mockResolvedValue(null);
      req.params = { id: id.toString() };

      await paymentMethodController.getPaymentMethodById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Payment method not found",
      });
    });
  });
});

describe("PaymentStatusController", () => {
  let paymentStatusService: PaymentStatusService;
  let paymentStatusController: PaymentStatusController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    paymentStatusService = new PaymentStatusService();
    paymentStatusController = new PaymentStatusController(paymentStatusService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
  });

  describe("createPaymentStatus", () => {
    it("should create a new payment status", async () => {
      const paymentStatus = { id: 1, name: "Paid" };
      paymentStatusService.createPaymentStatus = jest
        .fn()
        .mockResolvedValue(paymentStatus);
      req.body = { name: "Paid" };

      await paymentStatusController.createPaymentStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(paymentStatus);
    });
  });

  describe("getPaymentStatusById", () => {
    it("should return a payment status by id", async () => {
      const id = 1;
      const paymentStatus = { id, name: "Paid" };
      paymentStatusService.getPaymentStatusById = jest
        .fn()
        .mockResolvedValue(paymentStatus);
      req.params = { id: id.toString() };

      await paymentStatusController.getPaymentStatusById(req, res);

      expect(res.json).toHaveBeenCalledWith(paymentStatus);
    });

    it("should return 404 status code if payment status not found", async () => {
      const id = 1;
      paymentStatusService.getPaymentStatusById = jest
        .fn()
        .mockResolvedValue(null);
      req.params = { id: id.toString() };

      await paymentStatusController.getPaymentStatusById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Payment status not found",
      });
    });
  });
});
