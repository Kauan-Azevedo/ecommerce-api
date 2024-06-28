import { PrismaClient, Order, Prisma } from '@prisma/client'
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

interface Product {
    id: number
    price: number
    stock: number
    name: string
    description: string | null
    value: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}

interface PaymentMethod {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    order?: OrderData[]
}


class OrderService {
    async calculatePrice(orderData: OrderData): Promise<number> {
        const total = await orderData.orderItems.reduce(async (accumulatorPromise, currentItem) => {
            const accumulator = await accumulatorPromise
            const productData = await prisma.product.findUnique({ where: { id: currentItem.productId } })

            if (!productData) {
                throw new Error(`Product with id ${currentItem.productId} not found`)
            }

            const product: Product = productData as unknown as Product

            if (product.stock < currentItem.quantity) {
                throw new Error(`Product with id ${currentItem.productId} has insufficient stock`)
            }

            return accumulator + (product.value * currentItem.quantity)
        }, Promise.resolve(0))


        return total
    }

    async reduceStock(orderData: OrderData): Promise<void> {
        await orderData.orderItems.reduce(async (accumulatorPromise, currentItem) => {
            await accumulatorPromise
            const productData = await prisma.product.findUnique({ where: { id: currentItem.productId } })

            if (!productData) {
                throw new Error(`Product with id ${currentItem.productId} not found`)
            }

            const product: Product = productData as unknown as Product

            if (product.stock < currentItem.quantity) {
                throw new Error(`Product with id ${currentItem.productId} has insufficient stock`)
            }

            await prisma.product.update({
                where: { id: currentItem.productId },
                data: {
                    stock: product.stock - currentItem.quantity,
                },
            })
        }, Promise.resolve())
    }

    async paymentMethodById(paymentMethodId: number): Promise<PaymentMethod | null> {
        return await prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId },
        })
    }

    async createOrder(orderData: OrderData): Promise<Order> {
        const orderTotalValue = await this.calculatePrice(orderData)

        orderData.value = orderTotalValue

        const order = await prisma.order.create({
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

        this.reduceStock(orderData)
        return order
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
            const paymentMethod = await this.paymentMethodById(orderData.paymentMethodId)

            if (!paymentMethod) {
                throw new Error('Invalid payment method')
            }

            if (paymentMethod.name.toLocaleLowerCase() == "paid") {
                throw new Error('Payment method is paid')
            }

            await prisma.orderInfo.deleteMany({
                where: { orderId: orderId },
            })

            orderData.value = await this.calculatePrice(orderData)

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