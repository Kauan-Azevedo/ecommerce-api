import { Request, Response } from "express"
import { PaymentStatusService } from "../services/paymentStatus.service"

class PaymentStatusController {
  constructor(private readonly paymentStatusService: PaymentStatusService) { }

  async createPaymentStatus(req: Request, res: Response) {
    try {
      const paymentStatus = await this.paymentStatusService.createPaymentStatus(req.body)
      res.json(paymentStatus)
    } catch (error) {
      console.error(error)
      res.statusCode = 400
    }
  }

  async getPaymentStatusById(req: Request, res: Response) {
    try {
      const paymentStatus = await this.paymentStatusService.getPaymentStatusById(Number(req.params.id))
      if (!paymentStatus) {
        return res.status(404).json({ message: "Payment status not found" })
      }
      res.json(paymentStatus)
    } catch (error) {
      console.error(error)
      res.statusCode = 400
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const statusId = Number(req.params.id)
      const paymentStatus = await this.paymentStatusService.updatePaymentStatus(statusId, req.body)
      if (!paymentStatus) {
        return res.status(404).json({ message: "Payment status not found" })
      }
      res.json(paymentStatus)
    } catch (error) {
      console.error(error)
      res.statusCode = 400
    }
  }

  async getAllPaymentStatuses(req: Request, res: Response) {
    try {
      const paymentStatuses = await this.paymentStatusService.getAllPaymentStatuses()
      res.json(paymentStatuses)
    } catch (error) {
      console.error(error)
      res.statusCode = 400
    }
  }

  async deletePaymentStatus(req: Request, res: Response) {
    try {
      const statusId = Number(req.params.id)
      const deleteResult = await this.paymentStatusService.deletePaymentStatus(statusId)
      if (!deleteResult) {
        return res.status(404).json({ message: "Payment status not found" })
      }
      res.json({ message: "Payment status deleted successfully" })
    } catch (error) {
      console.error(error)
      res.statusCode = 400
    }
  }
}

export { PaymentStatusController }