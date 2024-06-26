import { Request, Response } from 'express'
import { OrderService } from '../services/order.service'
import { Prisma } from '@prisma/client'

class OrderController {
    constructor(private readonly orderService: OrderService) { }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderData = req.body
            const order = await this.orderService.createOrder(orderData)
            res.status(201).json(order)
        } catch (error) {
            console.error('Error creating order:', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Internal Server Error' })
            }
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
            console.error('Error retrieving order:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }

    async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            const orderData = req.body
            const order = await this.orderService.updateOrder(orderId, orderData)
            res.status(200).json(order)
        } catch (error) {
            console.error('Error updating order:', error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                res.status(400).json({ error: error.message })
            } else {
                res.status(500).json({ error: 'Internal Server Error' })
            }
        }
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.id)
            const order = await this.orderService.deleteOrder(orderId)
            res.status(200).json(order)
        } catch (error) {
            console.error('Error deleting order:', error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export { OrderController }