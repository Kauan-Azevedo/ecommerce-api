import { Request, Response, NextFunction } from 'express'
import { OrderService } from '../services/order.service'
import prismaErrorHandler from '../../../prisma/middleware/errorHandler'
import { Prisma } from '@prisma/client';

class OrderController {
    constructor(private readonly orderService: OrderService) { }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderData = req.body
            const order = await this.orderService.createOrder(orderData)
            res.status(201).json(order)
        } catch (error: any) {
            this.orderErrorHandler(error, req, res, () => {
                prismaErrorHandler(error, req, res)
            })
        }
    }

    async getOrderById(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            const order = await this.orderService.getOrderById(orderId)
            if (order) {
                res.status(200).json(order)
            } else {
                res.status(404).json({ error: 'Order not found' })
            }
        } catch (error) {
            this.orderErrorHandler(error, req, res, () => {
                prismaErrorHandler(error, req, res)
            })
        }
    }

    async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            const orderData = req.body
            const order = await this.orderService.updateOrder(orderId, orderData)
            res.status(200).json(order)
        } catch (error) {
            this.orderErrorHandler(error, req, res, () => {
                prismaErrorHandler(error, req, res)
            })
        }
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            const order = await this.orderService.deleteOrder(orderId)
            res.status(200).json(order)
        } catch (error) {
            this.orderErrorHandler(error, req, res, () => {
                prismaErrorHandler(error, req, res)
            })
        }
    }

    orderErrorHandler(error: any, req: Request, res: Response, NextFunction: NextFunction): void {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.meta) {
            if (error.meta.field_name == 'Order_paymentMethodId_fkey (index)' || error.meta.field_name == 'Order_paymentStatusId_fkey (index)') {
                res.status(400).json({ error: 'Invalid payment method or status' })
                return
            }

            if (error.meta.field_name == 'Order_userId_fkey (index)') {
                res.status(400).json({ error: 'Invalid user' })
                return
            }

            if (error.meta.cause === "Record to update not found.") {
                res.status(404).json({ error: 'Order not found' })
                return
            }
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextFunction()
        }

        res.status(400).json({ error: error.message })
    }
}

export { OrderController }