"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const Prisma404_1 = require("../../../prisma/middleware/errors/Prisma404");
const Prisma422_1 = require("../../../prisma/middleware/errors/Prisma422");
const Prisma400_1 = require("../../../prisma/middleware/errors/Prisma400");
const prisma = new client_1.PrismaClient();
class OrderService {
    isValidOrderItems(orderItems) {
        orderItems.forEach((item) => {
            if (!item.quantity || !item.productId) {
                return false;
            }
        });
        return true;
    }
    calculatePrice(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield orderData.orderItems.reduce((accumulatorPromise, currentItem) => __awaiter(this, void 0, void 0, function* () {
                    const accumulator = yield accumulatorPromise;
                    const product = yield prisma.product.findUnique({
                        where: { id: currentItem.productId },
                    });
                    if (!product) {
                        throw new Prisma404_1.PrismaError404(`Product with id ${currentItem.productId} not found`);
                    }
                    if (product.stock < currentItem.quantity) {
                        throw new Prisma422_1.PrismaError422(`Product with id ${currentItem.productId} has insufficient stock`);
                    }
                    return accumulator + product.value * currentItem.quantity;
                }), Promise.resolve(0));
                return total;
            }
            catch (error) {
                throw error;
            }
        });
    }
    reduceStock(quantity, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all(orderData.orderItems.map((currentItem) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield prisma.product.findUnique({
                        where: { id: currentItem.productId },
                    });
                    if (!product) {
                        throw new Prisma404_1.PrismaError404(`Product with id ${currentItem.productId} not found`);
                    }
                    if (product.stock < currentItem.quantity) {
                        throw new Prisma422_1.PrismaError422(`Product with id ${currentItem.productId} has insufficient stock`);
                    }
                    const newProductStock = product.stock - quantity;
                    yield prisma.product.update({
                        where: { id: currentItem.productId },
                        data: {
                            stock: newProductStock,
                        },
                    });
                })));
            }
            catch (error) {
                throw error;
            }
        });
    }
    paymentMethodById(paymentMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.paymentMethod.findUnique({
                where: { id: paymentMethodId },
            });
        });
    }
    paymentStatusById(paymentStatusId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.paymentMethod.findUnique({
                where: { id: paymentStatusId },
            });
        });
    }
    returnItemsToStock(quantity, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all(orderData.orderItems.map((currentItem) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield prisma.product.findUnique({
                        where: { id: currentItem.productId },
                    });
                    if (!product) {
                        throw new Prisma404_1.PrismaError404(`Product with id ${currentItem.productId} not found`);
                    }
                    yield prisma.product.update({
                        where: { id: currentItem.productId },
                        data: {
                            stock: product.stock + quantity,
                        },
                    });
                })));
            }
            catch (error) {
                throw error;
            }
        });
    }
    returnAllTheItemsToStock(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderInfos = yield prisma.orderInfo.findMany({
                    where: { orderId: order.id },
                });
                yield Promise.all(orderInfos.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const product = yield prisma.product.findUnique({
                        where: { id: item.productId },
                    });
                    if (!product) {
                        throw new Prisma404_1.PrismaError404(`Product not found`);
                    }
                    yield prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: product.stock + item.quantity,
                        },
                    });
                })));
            }
            catch (error) {
                throw error;
            }
        });
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidOrderItems(orderData.orderItems)) {
                throw new Prisma400_1.PrismaError400("Invalid order items");
            }
            try {
                const paymentMethod = yield this.paymentMethodById(orderData.paymentMethodId);
                const paymentStatus = yield this.paymentStatusById(orderData.paymentStatusId);
                if (!paymentMethod) {
                    throw new Prisma400_1.PrismaError400("Invalid payment method");
                }
                if (!paymentStatus) {
                    throw new Prisma400_1.PrismaError400("Invalid payment status");
                }
                const orderTotalValue = yield this.calculatePrice(orderData);
                orderData.value = orderTotalValue;
                const newOrder = yield prisma.order.create({
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
                yield Promise.all(newOrder.orderInfos.map((item) => {
                    return this.reduceStock(item.quantity, orderData);
                }));
                return newOrder;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.order.findMany({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.order.findMany({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOrdersByPaymentStatus(paymentStatusId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield prisma.order.findMany({
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
                    throw new Prisma404_1.PrismaError404("There is no order with this payment status");
                }
                return orders;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOrdersByPaymentMethod(paymentMethodId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield prisma.order.findMany({
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
                    throw new Prisma404_1.PrismaError404("There is no order with this payment method");
                }
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield prisma.order.findUnique({
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
                    throw new Prisma404_1.PrismaError404("Order not found");
                }
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateOrder(orderId, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidOrderItems(orderData.orderItems)) {
                throw new Prisma400_1.PrismaError400("Invalid order items");
            }
            try {
                const paymentMethod = yield this.paymentMethodById(orderData.paymentMethodId);
                const paymentStatus = yield this.paymentStatusById(orderData.paymentStatusId);
                const checkOrder = yield prisma.order.findUnique({
                    where: { id: orderId },
                });
                if (!checkOrder) {
                    throw new Prisma404_1.PrismaError404("Order not found");
                }
                if (!paymentMethod) {
                    throw new Prisma400_1.PrismaError400("Invalid payment method");
                }
                if (!paymentStatus) {
                    throw new Prisma400_1.PrismaError400("Invalid payment status");
                }
                const oldOrder = yield prisma.order.findUnique({
                    where: { id: orderId },
                    include: {
                        orderInfos: true,
                    },
                });
                if (oldOrder === null || oldOrder === void 0 ? void 0 : oldOrder.orderInfos) {
                    yield this.returnAllTheItemsToStock(oldOrder);
                    for (const item of oldOrder.orderInfos) {
                        yield prisma.orderInfo.update({
                            where: { id: item.id },
                            data: {
                                deletedAt: new Date(),
                            },
                        });
                    }
                    yield prisma.orderInfo.updateMany({
                        where: { orderId: orderId },
                        data: {
                            deletedAt: new Date(),
                        },
                    });
                    yield prisma.order.update({
                        where: { id: orderId },
                        data: {
                            deletedAt: new Date(),
                        },
                    });
                }
                orderData.value = yield this.calculatePrice(orderData);
                const updatedOrder = yield this.createOrder(orderData);
                return updatedOrder;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield prisma.order.update({
                    where: { id: orderId },
                    data: {
                        deletedAt: new Date(),
                    },
                });
                if (!order) {
                    throw new Prisma404_1.PrismaError404("Order not found");
                }
                yield this.returnAllTheItemsToStock(order);
                return order;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.OrderService = OrderService;
