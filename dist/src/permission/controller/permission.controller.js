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
exports.PermissionController = void 0;
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const client_1 = require("@prisma/client");
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
class PermissionController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    isPayloadValid(payload) {
        if (!payload.name || payload.name === "") {
            return false;
        }
        return true;
    }
    createPermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const permission = yield this.permissionService.createPermission(req.body);
                res.status(201).send(permission);
            }
            catch (error) {
                this.permissionErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getPermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissions = yield this.permissionService.getPermissions();
                if (!permissions || permissions.length === 0) {
                    throw new Prisma404_1.PrismaError404("Permissions not found");
                }
                res.status(200).send(permissions);
            }
            catch (error) {
                this.permissionErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getPermissionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield this.permissionService.getPermissionById(Number(req.params.id));
                if (!permission) {
                    throw new Prisma404_1.PrismaError404("Permission not found");
                }
                res.status(200).send(permission);
            }
            catch (error) {
                this.permissionErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    updatePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                const permission = yield this.permissionService.updatePermission(Number(req.params.id), req.body);
                if (!permission) {
                    throw new Prisma404_1.PrismaError404("Permission not found");
                }
                res.status(200).send(permission);
            }
            catch (error) {
                this.permissionErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    deletePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permission = yield this.permissionService.deletePermission(Number(req.params.id));
                if (!permission) {
                    throw new Prisma404_1.PrismaError404("Permission not found");
                }
                res.status(200).send(permission);
            }
            catch (error) {
                this.permissionErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    permissionErrorHandler(error, req, res, next) {
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            error;
            return res.status(400).json({ error: "Invalid payload provided." });
        }
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            return res.status(error.code).json({ error: error.message });
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            error;
            if (error.code === "P2025") {
                return res.status(404).json({ error: "Permission not found" });
            }
        }
        next(error, req, res);
    }
}
exports.PermissionController = PermissionController;
