import { Request, Response } from "express"
import { PaymentMethodService } from "../services/paymentMethod.service"

export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) { }

    async createPaymentMethod(req: Request, res: Response) {
        try {
            const paymentMethod = await this.paymentMethodService.createPaymentMethod(req.body)

            if (!paymentMethod) {
                return res.status(409).json({ message: `Payment method with name ${req.body.name} already exists.` })
            }

            res.json(paymentMethod)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async getPaymentMethodById(req: Request, res: Response) {
        try {
            const paymentMethod = await this.paymentMethodService.getPaymentMethodById(Number(req.params.id))
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" })
            }
            res.json(paymentMethod)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async updatePaymentMethod(req: Request, res: Response) {
        try {
            const methodId = Number(req.params.id)
            const paymentMethod = await this.paymentMethodService.updatePaymentMethod(methodId, req.body)
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" })
            }
            res.json(paymentMethod)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async getAllPaymentMethods(req: Request, res: Response) {
        try {
            const paymentMethods = await this.paymentMethodService.getAllPaymentMethods()
            res.json(paymentMethods)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async deletePaymentMethod(req: Request, res: Response) {
        try {
            const methodId = Number(req.params.id)
            const paymentMethod = await this.paymentMethodService.deletePaymentMethod(methodId)
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" })
            }
            res.json(paymentMethod)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }
}