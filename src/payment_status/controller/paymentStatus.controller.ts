import { Request, Response } from "express"
import { PaymentStatusService } from "../services/paymentStatus.service"
import prismaErrorHandler from "prisma/middleware/errorHandler"

class PaymentStatusController {
  constructor(private readonly paymentStatusService: PaymentStatusService) { }

  async createPaymentStatus(req: Request, res: Response) {
    try {
      const paymentStatus = await this.paymentStatusService.createPaymentStatus(req.body)
      return res.json(paymentStatus)
    } catch (error) {
      return this.paymentStatusErrorHandler(error, req, res, prismaErrorHandler)
    }
  }

  async getPaymentStatusById(req: Request, res: Response) {
    try {
      const paymentStatus = await this.paymentStatusService.getPaymentStatusById(Number(req.params.id))
      if (!paymentStatus) {
        return res.status(404).json({ message: "Payment status not found" })
      }

      return res.json(paymentStatus)
    } catch (error) {
      return this.paymentStatusErrorHandler(error, req, res, prismaErrorHandler)
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const statusId = Number(req.params.id)
      const paymentStatus = await this.paymentStatusService.updatePaymentStatus(statusId, req.body)

      if (!paymentStatus) {
        return res.status(404).json({ message: "Payment status not found" })
      }

      return res.json(paymentStatus)
    } catch (error) {
      return this.paymentStatusErrorHandler(error, req, res, prismaErrorHandler)
    }
  }

  async getAllPaymentStatuses(req: Request, res: Response) {
    try {
      return res.json(await this.paymentStatusService.getAllPaymentStatuses())
    } catch (error) {
      return this.paymentStatusErrorHandler(error, req, res, prismaErrorHandler)
    }
  }

  async deletePaymentStatus(req: Request, res: Response) {
    try {
      const statusId = Number(req.params.id)
      const deleteResult = await this.paymentStatusService.deletePaymentStatus(statusId)

      if (!deleteResult) {
        return res.status(404).json({ message: "Payment status not found" })
      }

      return res.json(deleteResult)
    } catch (error) {
      return this.paymentStatusErrorHandler(error, req, res, prismaErrorHandler)
    }
  }

  paymentStatusErrorHandler(error: any, req: Request, res: Response, next: Function) {
    console.log(error)
    next(error, req, res)
  }
}

export { PaymentStatusController }