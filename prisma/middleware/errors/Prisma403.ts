import { PrismaHttpError } from "./PrismaHttpError";

export class PrismaError403 extends PrismaHttpError {
    constructor(message: string) {
        super(message, 403);
        Object.setPrototypeOf(this, PrismaError403.prototype);
    }
}