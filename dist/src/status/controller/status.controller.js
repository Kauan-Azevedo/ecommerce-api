"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
class StatusController {
    constructor(statusService) {
        this.statusService = statusService;
    }
    isPayloadValid(payload) {
        if (!payload.name) {
            return false;
        }
        return true;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.statusService.getAll();
                if (!data || data.length === 0) {
                    throw new Prisma404_1.PrismaError404("No statuses found");
                }
                res.status(200).json(data);
            }
            catch (error) {
                this.statusErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = yield this.statusService.getById(id);
                if (!data) {
                    throw new Prisma404_1.PrismaError404("Status not found");
                }
                res.status(200).json(data);
            }
            catch (error) {
                this.statusErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const data = yield this.statusService.create(req.body);
                res.status(201).json(data);
            }
            catch (error) {
                this.statusErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const id = parseInt(req.params.id);
                const data = yield this.statusService.update(id, req.body);
                if (!data) {
                    throw new Prisma404_1.PrismaError404("Status not found");
                }
                res.json(data);
            }
            catch (error) {
                this.statusErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = yield this.statusService.delete(id);
                if (!data) {
                    throw new Prisma404_1.PrismaError404("Status not found");
                }
                res.status(200).json(data);
            }
            catch (error) {
                this.statusErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    statusErrorHandler(error, req, res, NextFunction) {
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            return res.status(error.code).json({ error: error.message });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.meta) {
            if (error.meta.cause === "Record to update not found." ||
                error.meta.cause === "Record to delete does not exist.") {
                return res.status(404).json({ error: "Status not found" });
            }
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError ||
            error instanceof client_1.Prisma.PrismaClientValidationError) {
            return NextFunction();
        }
        res.status(400).json({ error: error.message });
    }
}
exports.StatusController = StatusController;
