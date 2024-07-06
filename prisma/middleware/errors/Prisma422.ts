import { PrismaHttpError } from "./PrismaHttpError";

export class PrismaError422 extends PrismaHttpError {
    constructor(message: string) {
        super(message, 422);
        Object.setPrototypeOf(this, PrismaError422.prototype);
    }
}