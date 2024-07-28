"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UsersController = void 0;
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
const auth_decorator_1 = require("@/utils/auth.decorator");
const client_1 = require("@prisma/client");
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    isEmailValid(email) {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }
    validatePayload(req) {
        const { email, password, id_permission, first_name, last_name, } = req.body;
        const typesValidation = typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof id_permission !== "number";
        const emptyValidation = email === "" || password === "" || id_permission <= 0 || first_name === "" || last_name === "";
        const nullValidation = email === null || password === null || id_permission === null || first_name === null || last_name === null;
        if (typesValidation || emptyValidation || nullValidation) {
            return false;
        }
        return true;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.validatePayload(req)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                if (!this.isEmailValid(req.body.email)) {
                    throw new Prisma400_1.PrismaError400("Invalid Email.");
                }
                if (req.body.password !== req.body.confirm_password) {
                    throw new Prisma400_1.PrismaError400("Password confirmation don't match.");
                }
                req.body.confirm_password = undefined;
                const adminID = yield this.usersService.getAdminPermission();
                if (adminID) {
                    if (req.body.id_permission === adminID.id) {
                        throw new Prisma400_1.PrismaError400("Can't create an Admin user");
                    }
                }
                const user = yield this.usersService.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.validatePayload(req)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                if (!this.isEmailValid(req.body.email)) {
                    throw new Prisma400_1.PrismaError400("Invalid Email.");
                }
                const user = yield this.usersService.createAdmin(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.id);
                const user = yield this.usersService.getUserById(userId);
                if (!user) {
                    throw new Prisma404_1.PrismaError404("User not found");
                }
                res.status(200).json(user);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.validatePayload(req)) {
                    throw new Prisma400_1.PrismaError400("Invalid payload provided.");
                }
                if (!this.isEmailValid(req.body.email)) {
                    throw new Prisma400_1.PrismaError400("Invalid Email.");
                }
                const userId = Number(req.params.id);
                const user = yield this.usersService.updateUser(userId, req.body);
                if (!user) {
                    throw new Prisma404_1.PrismaError404("User not found");
                }
                res.status(200).json(user);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.usersService.getAllUsers();
                if (!users) {
                    throw new Prisma404_1.PrismaError404("Users not found");
                }
                res.status(200).json(users);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.id);
                const user = yield this.usersService.deleteUser(userId);
                if (!user) {
                    throw new Prisma404_1.PrismaError404("User not found");
                }
                res.status(200).json(user);
            }
            catch (error) {
                this.userErrorHandler(error, req, res, () => {
                    (0, errorHandler_1.default)(error, req, res);
                });
            }
        });
    }
    userErrorHandler(error, req, res, NextFunction) {
        if (error instanceof PrismaHttpError_1.PrismaHttpError) {
            res.status(error.code).json({ error: error.message });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            error;
            res.status(400).json({ error: "Invalid payload provided." });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            if (error.meta && error.meta.cause === "No 'Permission' record(s) (needed to inline the relation on 'User' record(s)) was found for a nested connect on one-to-many relation 'PermissionToUser'.") {
                res.status(404).json({ error: "Permission not found" });
                return;
            }
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.meta) {
            if (error.meta.field_name === "User_permissionId_fkey") {
                res.status(400).json({ error: "Invalid permission ID" });
                return;
            }
            else if (error.meta.field_name === "User_email_key") {
                res.status(400).json({ error: "This email is already in use" });
                return;
            }
            else if (error.meta.field_name === "User_permissionId") {
                res.status(400).json({ error: "Invalid permission ID" });
                return;
            }
            else if (error.meta.field_name === "User_permissionId_fkey") {
                res.status(400).json({ error: "Invalid permission ID" });
                return;
            }
            else {
                NextFunction();
                return;
            }
        }
        res.status(400).json({ error: error.message || "Life snake 🔫🐍" });
    }
}
exports.UsersController = UsersController;
__decorate([
    (0, auth_decorator_1.Authenticated)(["Admin"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAdmin", null);
__decorate([
    (0, auth_decorator_1.Authenticated)(["Admin", "Seller", "User"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, auth_decorator_1.Authenticated)(["Admin"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, auth_decorator_1.Authenticated)(["Admin", "Seller", "User"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, auth_decorator_1.Authenticated)(["Admin"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
