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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPaymentStatus = seedPaymentStatus;
const setup_1 = require("./setup/setup");
let paymentStatusFromEnv = (_a = process.env.SEED_PAYMENT_STATUS) === null || _a === void 0 ? void 0 : _a.split(",").map((paymentStatus) => paymentStatus.trim());
function seedPaymentStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!paymentStatusFromEnv) {
            paymentStatusFromEnv = ["Paid", "Refunded", "Cancelled", "Failed", "Waiting Payment"];
        }
        for (const paymentStatus of paymentStatusFromEnv) {
            yield (0, setup_1.createPaymentStatus)(paymentStatus);
        }
    });
}
