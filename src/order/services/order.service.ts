import { PrismaClient, Order } from "@prisma/client";
import { OrderData, PaymentMethod } from "../interfaces/order.interfaces";
import { PrismaError404 } from "../../../prisma/middleware/errors/Prisma404";
import { PrismaError422 } from "../../../prisma/middleware/errors/Prisma422";
import { PrismaError400 } from "../../../prisma/middleware/errors/Prisma400";
import { OrderItemData } from "../interfaces/order.interfaces";

const prisma = new PrismaClient();

//RESOLVER CONFLITO AO DAR UPDATE NO ORDER (Produto não retonar ao stock e order fica vazia)

class OrderService {
  isValidOrderItems(orderItems: [OrderItemData]): boolean {
    orderItems.forEach((item) => {
      if (!item.quantity || !item.productId) {
        return false;
      }
    })

    return true
  }
  async calculatePrice(orderData: OrderData): Promise<number> {
    try {
      const total = await orderData.orderItems.reduce(async (accumulatorPromise, currentItem) => {
        const accumulator = await accumulatorPromise;
        const product = await prisma.product.findUnique({
          where: { id: currentItem.productId },
        });

        if (!product) {
          throw new PrismaError404(`Product with id ${currentItem.productId} not found`);
        }

        if (product.stock < currentItem.quantity) {
          throw new PrismaError422(`Product with id ${currentItem.productId} has insufficient stock`);
        }

        return accumulator + product.value * currentItem.quantity;
      }, Promise.resolve(0));

      return total;
    } catch (error) {
      throw error;
    }
  }

  async reduceStock(quantity: number, orderData: OrderData): Promise<void> {
    try {
      await Promise.all(orderData.orderItems.map(async (currentItem) => {
        const product = await prisma.product.findUnique({
          where: { id: currentItem.productId },
        });

        if (!product) {
          throw new PrismaError404(`Product with id ${currentItem.productId} not found`);
        }

        if (product.stock < currentItem.quantity) {
          throw new PrismaError422(`Product with id ${currentItem.productId} has insufficient stock`);
        }

        const newProductStock = product.stock - quantity;

        await prisma.product.update({
          where: { id: currentItem.productId },
          data: {
            stock: newProductStock,
          },
        });
      }));
    } catch (error) {
      throw error;
    }
  }

  async paymentMethodById(paymentMethodId: number): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });
  }

  async paymentStatusById(paymentStatusId: number): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.findUnique({
      where: { id: paymentStatusId },
    });
  }

  async returnItemsToStock(quantity: number, orderData: OrderData): Promise<void> {
    try {
      await Promise.all(orderData.orderItems.map(async (currentItem) => {
        const product = await prisma.product.findUnique({
          where: { id: currentItem.productId },
        });

        if (!product) {
          throw new PrismaError404(`Product with id ${currentItem.productId} not found`);
        }

        await prisma.product.update({
          where: { id: currentItem.productId },
          data: {
            stock: product.stock + quantity,
          },
        });
      }));
    } catch (error) {
      throw error;
    }
  }

  async returnAllTheItemsToStock(order: Order): Promise<void> {
    try {
      const orderInfos = await prisma.orderInfo.findMany({
        where: { orderId: order.id },
      });

      await Promise.all(orderInfos.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new PrismaError404(`Product not found`);
        }

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: product.stock + item.quantity,
          },
        });
      }));
    } catch (error) {
      throw error;
    }
  }

  async createOrder(orderData: OrderData): Promise<Order> {
    if (!this.isValidOrderItems(orderData.orderItems as unknown as [OrderItemData])) {
      throw new PrismaError400("Invalid order items");
    }

    try {

      const paymentMethod = await this.paymentMethodById(orderData.paymentMethodId);
      const paymentStatus = await this.paymentStatusById(orderData.paymentStatusId);

      if (!paymentMethod) {
        throw new PrismaError400("Invalid payment method");
      }

      if (!paymentStatus) {
        throw new PrismaError400("Invalid payment status");
      }

      const orderTotalValue = await this.calculatePrice(orderData);

      orderData.value = orderTotalValue;

      const newOrder = await prisma.order.create({
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
      });

      await Promise.all(newOrder.orderInfos.map((item) => {
        return this.reduceStock(item.quantity, orderData);
      }));

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
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
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
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
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByPaymentStatus(paymentStatusId: number): Promise<Order[]> {
    try {
      const orders = await prisma.order.findMany({
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
      });

      if (!orders) {
        throw new PrismaError404("There is no order with this payment status");
      }

      return orders;

    } catch (error) {
      throw error;
    }
  }

  async getOrdersByPaymentMethod(paymentMethodId: number): Promise<Order[]> {
    try {
      const order = await prisma.order.findMany({
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
      });

      if (!order) {
        throw new PrismaError404("There is no order with this payment method");
      }

      return order;

    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      const order = await prisma.order.findUnique({
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
      });

      if (!order) {
        throw new PrismaError404("Order not found");
      }

      return order;

    } catch (error) {
      throw error;
    }
  }

  async updateOrder(orderId: number, orderData: OrderData): Promise<Order> {
    if (!this.isValidOrderItems(orderData.orderItems as unknown as [OrderItemData])) {
      throw new PrismaError400("Invalid order items");
    }

    try {
      const paymentMethod = await this.paymentMethodById(orderData.paymentMethodId);
      const paymentStatus = await this.paymentStatusById(orderData.paymentStatusId);
      const checkOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!checkOrder) {
        throw new PrismaError404("Order not found");
      }

      if (!paymentMethod) {
        throw new PrismaError400("Invalid payment method");
      }

      if (!paymentStatus) {
        throw new PrismaError400("Invalid payment status");
      }

      const oldOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderInfos: true,
        },
      });

      if (oldOrder?.orderInfos) {
        await this.returnAllTheItemsToStock(oldOrder);

        for (const item of oldOrder.orderInfos) {
          await prisma.orderInfo.update({
            where: { id: item.id },
            data: {
              deletedAt: new Date(),
            },
          });
        }

        await prisma.orderInfo.updateMany({
          where: { orderId: orderId },
          data: {
            deletedAt: new Date(),
          },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: {
            deletedAt: new Date(),
          },
        });

      }

      orderData.value = await this.calculatePrice(orderData);

      const updatedOrder = await this.createOrder(orderData);
      return updatedOrder;

    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(orderId: number): Promise<Order> {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          deletedAt: new Date(),
        },
      });

      if (!order) {
        throw new PrismaError404("Order not found");
      }

      await this.returnAllTheItemsToStock(order);

      return order;
    } catch (error) {
      throw error;
    }
  }
}

export { OrderService };
