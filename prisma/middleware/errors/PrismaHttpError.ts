export class PrismaHttpError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = `PrismaHttpError${code}`;
        Object.setPrototypeOf(this, PrismaHttpError.prototype);
    }
}