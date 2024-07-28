"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaError400 = void 0;
const PrismaHttpError_1 = require("./PrismaHttpError");
class PrismaError400 extends PrismaHttpError_1.PrismaHttpError {
    constructor(message) {
        super(message, 400);
        Object.setPrototypeOf(this, PrismaError400.prototype);
    }
}
exports.PrismaError400 = PrismaError400;
