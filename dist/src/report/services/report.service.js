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
exports.ReportService = void 0;
const prisma_service_1 = require("@/db/prisma.service");
class ReportService {
    constructor() { }
    getAllUnfinishedOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.order.findMany({
                where: {
                    statusid: 1 || 2,
                },
            });
        });
    }
    getOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.order.findMany({
                where: {
                    userId: userId,
                },
            });
        });
    }
}
exports.ReportService = ReportService;