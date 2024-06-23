import { PrismaClient, Order } from '@prisma/client'
const prisma = new PrismaClient()

interface OrderData {
    paymentMethodId: number
    paymentStatusId: number
    userId: number
    description?: string
    date: Date
    value: number
    orderItems: OrderItemData[]
}

interface OrderItemData {
    productId: number
    quantity: number
}

class OrderService {
    async createOrder(orderData: OrderData): Promise<Order> {
        return await prisma.order.create({
            data: {
                paymentMethodId: orderData.paymentMethodId,
                paymentStatusId: orderData.paymentStatusId,
                userId: orderData.userId,
                description: orderData.description,
                date: orderData.date,
                value: orderData.value,
                orderInfos: {
                    create: orderData.orderItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                orderInfos: true,
            },
        })
    }

    async getOrderById(orderId: number): Promise<Order | null> {
        return await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderInfos: {
                    include: {
                        product: true,
                    },
                },
                user: true,
                paymentMethod: true,
                paymentStatus: true,
            },
        })
    }

    async updateOrder(orderId: number, orderData: OrderData): Promise<Order> {
        return await prisma.$transaction(async (prisma) => {
            await prisma.orderInfo.deleteMany({
                where: { orderId: orderId },
            })

            const order = await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentMethodId: orderData.paymentMethodId,
                    paymentStatusId: orderData.paymentStatusId,
                    userId: orderData.userId,
                    description: orderData.description,
                    date: orderData.date,
                    value: orderData.value,
                    updatedAt: new Date(),
                    orderInfos: {
                        create: orderData.orderItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    orderInfos: true,
                },
            })

            return order
        })
    }

    async deleteOrder(orderId: number): Promise<Order> {
        return await prisma.order.update({
            where: { id: orderId },
            data: {
                deletedAt: new Date(),
            },
        })
    }
}

export { OrderService }