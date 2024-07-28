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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const errorHandler_1 = __importDefault(require("../../../prisma/middleware/errorHandler"));
const Prisma404_1 = require("../../../prisma/middleware/errors/Prisma404");
const PrismaHttpError_1 = require("../../../prisma/middleware/errors/PrismaHttpError");
const client_1 = require("@prisma/client");
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    isValidPayload(orderData) {
        if (!orderData.paymentMethodId ||
            !orderData.paymentStatusId ||
            !orderData.statusid ||
            !orderData.userId ||
            !orderData.orderItems) {
            return false;
        }
        return true;
    }
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////Getters//////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = parseInt(req.params.id);
                const order = yield this.orderService.getOrderById(orderId);
                if (order) {
                    res.status(200).json(order);
                }
                else {
                    throw new Prisma404_1.PrismaError404("Order not found");
                }
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderService.getAllOrders();
                if (orders.length === 0 || !orders) {
                    throw new Prisma404_1.PrismaError404("No found any orders");
                }
                res.status(200).json(orders);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getOrdersByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.id);
                const orders = yield this.orderService.getOrdersByUserId(userId);
                res.status(200).json(orders);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getOrdersByPaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentStatusId = parseInt(req.params.id);
                const orders = yield this.orderService.getOrdersByPaymentStatus(paymentStatusId);
                res.status(200).json(orders);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getOrdersByPaymentMethod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentMethodId = parseInt(req.params.id);
                const orders = yield this.orderService.getOrdersByPaymentMethod(paymentMethodId);
                res.status(200).json(orders);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////END OF THE GETTERS////////////////////////
    /////////////////////////////////////////////////////////////////////////
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidPayload(req.body)) {
                res.status(400).json({ error: "Invalid payload" });
                return;
            }
            try {
                const orderData = req.body;
                const order = yield this.orderService.createOrder(orderData);
                res.status(201).json(order);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = parseInt(req.params.id);
                const orderData = req.body;
                const order = yield this.orderService.updateOrder(orderId, orderData);
                res.status(200).json(order);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = parseInt(req.params.id);
                const order = yield this.orderService.deleteOrder(orderId);
                res.status(204).json(order);
            }
            catch (error) {
                this.orderErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    orderErrorHandler(error, req, res, NextFunction) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.meta) {
            if (error.meta.field_name == "Order_paymentMethodId_fkey (index)" ||
                error.meta.field_name == "Order_paymentStatusId_fkey (index)") {
                res.status(400).json({ error: "Invalid payment method or status" });
                return;
            }
            if (error.meta.field_name == "Order_userId_fkey (index)") {
                res.status(400).json({ error: "Invalid user" });
                return;
            }
            if (error.meta.cause === "Record to update not found.") {
                res.status(404).json({ error: "Order not found" });
                return;
            }
        }
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            res.status(error.code).json({ error: error.message });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError ||
            error instanceof client_1.Prisma.PrismaClientValidationError) {
            return NextFunction();
        }
        res.status(400).json({ error: error.message });
    }
}
exports.OrderController = OrderController;
