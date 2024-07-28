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
const payment_method_1 = require("./seeds/payment-method");
const payment_status_1 = require("./seeds/payment-status");
const permission_1 = require("./seeds/permission");
const status_1 = require("./seeds/status");
const user_1 = require("./seeds/user");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("\n\nSEEDING DATABASE\n\n");
        yield (0, permission_1.seedPermissions)();
        yield (0, status_1.seedStatus)();
        yield (0, payment_method_1.seedPaymentMethods)();
        yield (0, payment_status_1.seedPaymentStatus)();
        yield (0, user_1.seedUsers)();
        console.log("\n\nFINISHED SEEDING \n\n");
    });
}
main();
