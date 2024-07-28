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
exports.PaymentMethodController = void 0;
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
const client_1 = require("@prisma/client");
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
class PaymentMethodController {
    constructor(paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }
    isValidPayload(paymentMethod) {
        if (!paymentMethod.name || paymentMethod.name === "") {
            return false;
        }
        return true;
    }
    createPaymentMethod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isValidPayload(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const paymentMethod = yield this.paymentMethodService.createPaymentMethod(req.body);
                res.status(201).json(paymentMethod);
            }
            catch (error) {
                return this.PaymentMethodErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getPaymentMethodById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentMethod = yield this.paymentMethodService.getPaymentMethodById(Number(req.params.id));
                if (!paymentMethod) {
                    throw new Prisma404_1.PrismaError404("Payment method not found");
                }
                res.json(paymentMethod);
            }
            catch (error) {
                return this.PaymentMethodErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    updatePaymentMethod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isValidPayload(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const methodId = Number(req.params.id);
                const paymentMethod = yield this.paymentMethodService.updatePaymentMethod(methodId, req.body);
                if (!paymentMethod) {
                    throw new Prisma404_1.PrismaError404("Payment method not found");
                }
                return res.json(paymentMethod);
            }
            catch (error) {
                return this.PaymentMethodErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getAllPaymentMethods(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentMethods = yield this.paymentMethodService.getAllPaymentMethods();
                if (paymentMethods.length === 0 || !paymentMethods) {
                    throw new Prisma404_1.PrismaError404("No found any payment methods");
                }
                res.json(paymentMethods);
            }
            catch (error) {
                return this.PaymentMethodErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    deletePaymentMethod(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const methodId = Number(req.params.id);
                const paymentMethod = yield this.paymentMethodService.deletePaymentMethod(methodId);
                if (!paymentMethod) {
                    throw new Prisma404_1.PrismaError404("Payment method not found");
                }
                return res.json(paymentMethod);
            }
            catch (error) {
                return this.PaymentMethodErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    PaymentMethodErrorHandler(error, req, res, next) {
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            error;
            return res.status(400).json({ error: "Invalid payload provided." });
        }
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            res.status(error.code).json({ error: error.message });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            error;
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Payment method not found" });
            }
        }
        return next(error, req, res);
    }
}
exports.PaymentMethodController = PaymentMethodController;
