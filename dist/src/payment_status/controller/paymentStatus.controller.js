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
exports.PaymentStatusController = void 0;
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const client_1 = require("@prisma/client");
class PaymentStatusController {
    constructor(paymentStatusService) {
        this.paymentStatusService = paymentStatusService;
    }
    isPayloadValid(payload) {
        if (!payload.name || payload.name === "") {
            return false;
        }
        return true;
    }
    createPaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const paymentStatus = yield this.paymentStatusService.createPaymentStatus(req.body);
                res.status(201).json(paymentStatus);
            }
            catch (error) {
                return this.paymentStatusErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getPaymentStatusById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentStatus = yield this.paymentStatusService.getPaymentStatusById(Number(req.params.id));
                if (!paymentStatus) {
                    throw new Prisma404_1.PrismaError404("Payment status not found");
                }
                res.status(200).json(paymentStatus);
            }
            catch (error) {
                this.paymentStatusErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    updatePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const statusId = Number(req.params.id);
                const paymentStatus = yield this.paymentStatusService.updatePaymentStatus(statusId, req.body);
                if (!paymentStatus) {
                    throw new Prisma404_1.PrismaError404("Payment status not found");
                }
                res.json(paymentStatus);
            }
            catch (error) {
                this.paymentStatusErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getAllPaymentStatuses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.paymentStatusService.getAllPaymentStatuses();
                if (!response || response.length === 0) {
                    throw new Prisma404_1.PrismaError404("No payment statuses found");
                }
            }
            catch (error) {
                this.paymentStatusErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    deletePaymentStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statusId = Number(req.params.id);
                const deleteResult = yield this.paymentStatusService.deletePaymentStatus(statusId);
                if (!deleteResult) {
                    throw new Prisma404_1.PrismaError404("Payment status not found");
                }
                res.json(deleteResult);
            }
            catch (error) {
                this.paymentStatusErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    paymentStatusErrorHandler(error, req, res, next) {
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            error;
            return res.status(400).json({ error: "Invalid payload provided." });
        }
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            return res.status(error.code).json({ error: error.message });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            error;
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Payment status not found" });
            }
        }
        next(error, req, res);
    }
}
exports.PaymentStatusController = PaymentStatusController;
