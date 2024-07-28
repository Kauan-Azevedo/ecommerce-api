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
exports.AuthService = void 0;
const prisma_service_1 = require("@/db/prisma.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_service_1.prisma.user.findUnique({
                where: { email },
                include: {
                    permission: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                throw new Error("Invalid credentials!");
            }
            const secretKey = process.env.SECRET_KEY || "";
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, permission: user.permission.name }, secretKey, { expiresIn: "24h" });
            return { user, token };
        });
    }
}
exports.AuthService = AuthService;
