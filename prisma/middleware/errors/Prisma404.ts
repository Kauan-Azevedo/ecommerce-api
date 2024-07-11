import { PrismaHttpError } from "./PrismaHttpError";

export class PrismaError404 extends PrismaHttpError {
    constructor(message: string) {
        super(message, 404);
        Object.setPrototypeOf(this, PrismaError404.prototype);
    }
}