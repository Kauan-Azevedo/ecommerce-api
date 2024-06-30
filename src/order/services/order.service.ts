import { PrismaClient, Order } from '@prisma/client'

import { OrderData, PaymentMethod, Product } from "../interfaces/order.interfaces"

const prisma = new PrismaClient()

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

    async reduceStock(quantity: number, orderData: OrderData): Promise<void> {
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

            const newProductStock = product.stock - quantity

            await prisma.product.update({
                where: { id: currentItem.productId },
                data: {
                    stock: newProductStock,
                },
            })
        }, Promise.resolve())
    }

    async paymentMethodById(paymentMethodId: number): Promise<PaymentMethod | null> {
        return await prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId },
        })
    }

    async paymentStatusById(paymentStatusId: number): Promise<PaymentMethod | null> {
        return await prisma.paymentMethod.findUnique({
            where: { id: paymentStatusId },
        })
    }

    async returnItemsToStock(quantity: number, orderData: OrderData): Promise<void> {
        await orderData.orderItems.reduce(async (accumulatorPromise, currentItem) => {
            await accumulatorPromise
            const productData = await prisma.product.findUnique({ where: { id: currentItem.productId } })

            if (!productData) {
                throw new Error(`Product with id ${currentItem.productId} not found`)
            }

            const product: Product = productData as unknown as Product

            await prisma.product.update({
                where: { id: currentItem.productId },
                data: {
                    stock: product.stock + quantity,
                },
            })
        }, Promise.resolve())
    }

    async returnAllTheItemsToStock(orderData: Order): Promise<void> {
        const ordersInfo = await prisma.orderInfo.findMany({
            where: { orderId: orderData.id },
        })

        ordersInfo.forEach(async (item) => {
            await prisma.product.findUnique({
                where: { id: item.productId },
            }).then(
                async (productData) => {
                    const product: Product = productData as unknown as Product

                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: product.stock + item.quantity,
                        },
                    })
                }
            )
        })

    }

    async createOrder(orderData: OrderData): Promise<Order> {
        const orderTotalValue = await this.calculatePrice(orderData)

        orderData.value = orderTotalValue

        const order = await prisma.order.create({
            data: {
                paymentMethodId: orderData.paymentMethodId,
                paymentStatusId: orderData.paymentStatusId,
                statusid: orderData.statusid,
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

        order.orderInfos.forEach(async (item) => {
            this.reduceStock(item.quantity, orderData)
        })

        return order
    }

    async getAllOrders(): Promise<Order[]> {
        return await prisma.order.findMany({
            where: { deletedAt: null },
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

    async getOrdersByUserId(userId: number): Promise<Order[]> {
        return await prisma.order.findMany({
            where: { userId: userId, deletedAt: null },
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

    async getOrdersByPaymentStatus(paymentStatusId: number): Promise<Order[]> {
        return await prisma.order.findMany({
            where: { paymentStatusId: paymentStatusId, deletedAt: null },
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

    async getOrdersByPaymentMethod(paymentMethodId: number): Promise<Order[]> {
        return await prisma.order.findMany({
            where: { paymentMethodId: paymentMethodId, deletedAt: null },
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
            const paymentStatus = await this.paymentStatusById(orderData.paymentStatusId)

            if (!paymentMethod) {
                throw new Error('Invalid payment method')
            }

            if (!paymentStatus) {
                throw new Error('Invalid payment status')
            }

            // if (paymentStatus.name === 'paid') {
            //     throw new Error('You cannot change the payment status to paid')
            // }

            orderData.orderItems.forEach(async (item) => {
                const oldOrderInfo = await prisma.orderInfo.findMany({
                    where: { orderId: orderId },
                })

                oldOrderInfo.forEach(async (oldItem) => {
                    if (item.quantity > oldItem.quantity) {
                        const quantity = item.quantity - oldItem.quantity
                        console.log(item.quantity, oldItem.quantity, quantity)
                        await this.reduceStock(quantity, orderData)
                    } else {
                        const quantity = oldItem.quantity - item.quantity
                        await this.returnItemsToStock(quantity, orderData)
                    }
                })

            })

            await prisma.orderInfo.deleteMany({
                where: { orderId: orderId },
            })

            orderData.value = await this.calculatePrice(orderData)

            const order = await prisma.order.update({
                where: { id: orderId },
                data: {
                    paymentMethodId: orderData.paymentMethodId,
                    paymentStatusId: orderData.paymentStatusId,
                    statusid: orderData.statusid,
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
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                deletedAt: new Date(),
            },
        })

        this.returnAllTheItemsToStock(order)

        return order
    }
}

export { OrderService }