"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHttpError = void 0;
class PrismaHttpError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = `PrismaHttpError${code}`;
        Object.setPrototypeOf(this, PrismaHttpError.prototype);
    }
}
exports.PrismaHttpError = PrismaHttpError;
