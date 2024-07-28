"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaError403 = void 0;
const PrismaHttpError_1 = require("./PrismaHttpError");
class PrismaError403 extends PrismaHttpError_1.PrismaHttpError {
    constructor(message) {
        super(message, 403);
        Object.setPrototypeOf(this, PrismaError403.prototype);
    }
}
exports.PrismaError403 = PrismaError403;
