import { prisma } from "@/db/prisma.service"
import { Order } from ".prisma/client"

export class OrderService {
    async createOrder(order: Order) {
        try {
            return await prisma.order.create({ data: order })
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async getOrderById(id: number) {
        try {
            return await prisma.order.findUnique({ where: { id } })
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async getAllOrders() {
        try {
            return await prisma.order.findMany()
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async updateOrder(id: number, order: Order) {
        try {
            const record = await prisma.order.update({ where: { id }, data: order })

            if (!record) {
                throw new Error(`Order with ID ${id} not found on update.`);
            }

            return record
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async deleteOrder(id: number) {
        try {
            const record = await prisma.order.findUnique({ where: { id } });

            if (!record) {
                throw new Error(`Order with ID ${id} not found.`);
            }

            return await prisma.order.delete({ where: { id } });
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }
}