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
exports.ReportController = void 0;
class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    getAllUnfinishedOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.reportService.getAllUnfinishedOrders();
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getOrderByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const orders = yield this.reportService.getOrderByUserId(userId);
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.ReportController = ReportController;
