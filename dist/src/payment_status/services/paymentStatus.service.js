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
exports.PaymentStatusService = void 0;
const prisma_service_1 = require("@/db/prisma.service");
class PaymentStatusService {
    createPaymentStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentStatus.create({ data: status });
        });
    }
    getPaymentStatusById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentStatus.findUnique({ where: { id } });
        });
    }
    getAllPaymentStatuses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentStatus.findMany();
        });
    }
    updatePaymentStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentStatus.update({ where: { id }, data: status });
        });
    }
    deletePaymentStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.paymentStatus.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
}
exports.PaymentStatusService = PaymentStatusService;