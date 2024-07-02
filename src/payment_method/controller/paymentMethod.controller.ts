import { Request, Response } from "express"
import { PaymentMethodService } from "../services/paymentMethod.service"
import prismaErrorHandler from "prisma/middleware/errorHandler"
import { Prisma } from "@prisma/client"

export class PaymentMethodController {
    constructor(private readonly paymentMethodService: PaymentMethodService) { }

    async createPaymentMethod(req: Request, res: Response) {
        try {
            const paymentMethod = await this.paymentMethodService.createPaymentMethod(req.body)

            if (!paymentMethod) {
                return res.status(409).json({ message: `Payment method with name ${req.body.name} already exists.` })
            }

            return res.json(paymentMethod)
        } catch (error) {
            console.log(error)
            return this.PaymentMethodErrorHandler(error, req, res, prismaErrorHandler)
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
            return this.PaymentMethodErrorHandler(error, req, res, prismaErrorHandler)
        }
    }

    async updatePaymentMethod(req: Request, res: Response) {
        try {
            const methodId = Number(req.params.id)
            const paymentMethod = await this.paymentMethodService.updatePaymentMethod(methodId, req.body)
            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" })
            }
            return res.json(paymentMethod)
        } catch (error) {
            return this.PaymentMethodErrorHandler(error, req, res, prismaErrorHandler)
        }
    }

    async getAllPaymentMethods(req: Request, res: Response) {
        try {
            const paymentMethods = await this.paymentMethodService.getAllPaymentMethods()
            res.json(paymentMethods)
        } catch (error) {
            return this.PaymentMethodErrorHandler(error, req, res, prismaErrorHandler)
        }
    }

    async deletePaymentMethod(req: Request, res: Response) {
        try {
            const methodId = Number(req.params.id)
            const paymentMethod = await this.paymentMethodService.deletePaymentMethod(methodId)

            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" })
            }

            return res.json(paymentMethod)
        } catch (error) {
            return this.PaymentMethodErrorHandler(error, req, res, prismaErrorHandler)
        }
    }

    PaymentMethodErrorHandler(error: any, req: Request, res: Response, next: Function) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            error as Prisma.PrismaClientValidationError
            return res.status(400).json("Invalid payload provided.")
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            error as Prisma.PrismaClientKnownRequestError

            if (error.code === 'P2025') {
                return res.status(404).json({ message: "Payment method not found" })
            }
        }

        console.log(error)
        return next(error, req, res)
    }
}