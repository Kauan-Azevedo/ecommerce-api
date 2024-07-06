import { PrismaHttpError } from "./PrismaHttpError";

export class PrismaError400 extends PrismaHttpError {
    constructor(message: string) {
        super(message, 400);
        Object.setPrototypeOf(this, PrismaError400.prototype);
    }
}