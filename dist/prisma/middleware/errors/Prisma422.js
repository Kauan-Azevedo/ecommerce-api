"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaError422 = void 0;
const PrismaHttpError_1 = require("./PrismaHttpError");
class PrismaError422 extends PrismaHttpError_1.PrismaHttpError {
    constructor(message) {
        super(message, 422);
        Object.setPrototypeOf(this, PrismaError422.prototype);
    }
}
exports.PrismaError422 = PrismaError422;
