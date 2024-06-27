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

interface Product {
    id: number;
    price: number;
    stock: number;
    name: string;
    description: string | null;
    value: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}


class OrderService {
    async calculatePrice(orderData: OrderData): Promise<number> {
        const total = await orderData.orderItems.reduce(async (accumulatorPromise, currentItem) => {
            const accumulator = await accumulatorPromise;
            const productData = await prisma.product.findUnique({ where: { id: currentItem.productId } });

            if (!productData) {
                throw new Error(`Product with id ${currentItem.productId} not found`);
            }

            const product: Product = productData as unknown as Product;

            console.log(product.name);

            if (product.stock < currentItem.quantity) {
                throw new Error(`Product with id ${currentItem.productId} has insufficient stock`);
            }

            return accumulator + (product.value * currentItem.quantity);
        }, Promise.resolve(0));


        return total;
    }


    async createOrder(orderData: OrderData): Promise<Order> {
        const orderTotalValue = await this.calculatePrice(orderData)

        orderData.value = orderTotalValue

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