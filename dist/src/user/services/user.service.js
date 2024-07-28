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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const prisma_service_1 = require("@/db/prisma.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Prisma403_1 = require("prisma/middleware/errors/Prisma403");
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
class UsersService {
    getAdminPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.permission.findFirst({ where: { name: "Admin" } });
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, id_permission, id } = user, userData = __rest(user, ["password", "id_permission", "id"]);
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const adminID = yield this.getAdminPermission();
            if (adminID) {
                if (Number(adminID.id) === id_permission) {
                    throw new Prisma403_1.PrismaError403("Can't create an Admin user");
                }
            }
            return yield prisma_service_1.prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { password: hashedPassword, permission: { connect: { id: id_permission } } }),
            });
        });
    }
    createAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, id } = user, userData = __rest(user, ["password", "id"]);
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const adminID = yield prisma_service_1.prisma.permission.findFirst({
                where: { name: "Admin" },
            });
            if (!adminID) {
                throw new Prisma404_1.PrismaError404("Admin permission not found");
            }
            const id_permission = Number(adminID.id);
            return yield prisma_service_1.prisma.user.create({
                data: Object.assign(Object.assign({}, userData), { password: hashedPassword, id_permission: id_permission }),
            });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    phone_number: true,
                    createdAt: true,
                    updatedAt: true,
                    permission: {
                        select: {
                            name: true,
                        },
                    }
                }
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    phone_number: true,
                    createdAt: true,
                    updatedAt: true,
                    permission: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.user.update({ where: { id }, data: user });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_service_1.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
        });
    }
}
exports.UsersService = UsersService;
