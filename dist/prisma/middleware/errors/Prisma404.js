"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaError404 = void 0;
const PrismaHttpError_1 = require("./PrismaHttpError");
class PrismaError404 extends PrismaHttpError_1.PrismaHttpError {
    constructor(message) {
        super(message, 404);
        Object.setPrototypeOf(this, PrismaError404.prototype);
    }
}
exports.PrismaError404 = PrismaError404;
