import { Request, Response } from "express"
import { OrderService } from "../service/order.service"

export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    async createOrder(req: Request, res: Response) {
        try {
            const order = await this.orderService.createOrder(req.body)

            if (!order) {
                return res.status(409).json({ message: `Order with ID ${req.body.id} already exists.` })
            }

            res.json(order)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async getOrderById(req: Request, res: Response) {
        try {
            const order = await this.orderService.getOrderById(Number(req.params.id))
            if (!order) {
                return res.status(404).json({ message: "Order not found" })
            }
            res.json(order)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.id)
            const order = await this.orderService.updateOrder(orderId, req.body)
            if (!order) {
                return res.status(404).json({ message: "Order not found" })
            }
            res.json(order)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await this.orderService.getAllOrders()
            res.json(orders)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const orderId = Number(req.params.id)
            const order = await this.orderService.deleteOrder(orderId)
            if (!order) {
                return res.status(404).json({ message: "Order not found" })
            }
            res.json(order)
        } catch (error) {
            console.error(error)
            res.statusCode = 400
        }
    }
}