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
exports.seedUsers = seedUsers;
const setup_1 = require("./setup/setup");
const bcrypt_1 = __importDefault(require("bcrypt"));
function getEnvData() {
    const userInfo = {
        userEmail: process.env.SEED_USER_EMAIL,
        userPassword: process.env.SEED_USER_PASSWORD,
        userFirstName: process.env.SEED_USER_FIRST_NAME,
        userLastName: process.env.SEED_USER_LAST_NAME,
        userPhone: process.env.SEED_USER_PHONE,
    };
    for (const [key, value] of Object.entries(userInfo)) {
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    }
    return userInfo;
}
function seedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = getEnvData();
        userData.userPassword = yield bcrypt_1.default.hash(userData.userPassword, 10);
        yield (0, setup_1.createUser)(userData);
    });
}
