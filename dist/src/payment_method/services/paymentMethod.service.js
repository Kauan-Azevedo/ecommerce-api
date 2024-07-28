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
exports.PaymentMethodService = void 0;
const prisma_service_1 = require("@/db/prisma.service");
class PaymentMethodService {
    createPaymentMethod(paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentMethod.create({ data: paymentMethod });
        });
    }
    getPaymentMethodById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentMethod.findUnique({ where: { id } });
        });
    }
    getAllPaymentMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentMethod.findMany();
        });
    }
    updatePaymentMethod(id, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentMethod.update({
                where: { id },
                data: paymentMethod,
            });
        });
    }
    deletePaymentMethod(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentMethod.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
}
exports.PaymentMethodService = PaymentMethodService;
