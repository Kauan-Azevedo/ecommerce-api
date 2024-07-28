"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermission = createPermission;
exports.createUser = createUser;
exports.createStatus = createStatus;
exports.createPaymentMethod = createPaymentMethod;
exports.createPaymentStatus = createPaymentStatus;
exports.createProduct = createProduct;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createPermission(name) {
    if (!name) {
        console.log("Skip permission creation: Name not informed");
        return;
    }
    return prisma.permission.create({
        data: {
            name: name,
        },
    });
}
function createUser(userData) {
    if (!userData.userFirstName || !userData.userLastName || !userData.userEmail || !userData.userPhone || !userData.userPassword) {
        console.log("Skip user creation: Missing informations");
        return;
    }
    return prisma.user.create({
        data: {
            id_permission: 1,
            first_name: userData.userFirstName,
            last_name: userData.userLastName,
            email: userData.userEmail,
            phone_number: userData.userPhone,
            password: userData.userPassword,
        },
    });
}
function createStatus(name) {
    if (!name) {
        console.log("Skip status creation: Name not informed");
        return;
    }
    return prisma.status.create({
        data: {
            name: name,
        },
    });
}
function createPaymentMethod(name) {
    if (!name) {
        console.log("Skip payment method creation: Name not informed");
        return;
    }
    return prisma.paymentMethod.create({
        data: {
            name: name,
        },
    });
}
function createPaymentStatus(name) {
    if (!name) {
        console.log("Skip payment status creation: Name not informed");
        return;
    }
    return prisma.paymentStatus.create({
        data: {
            name: name,
        },
    });
}
function createProduct(name, description, price, stock, id_status) {
    if (!name || !description || !price || !stock || !id_status) {
        console.log("Skip product creation: Missing informations");
        return;
    }
    return prisma.product.create({
        data: {
            name: name,
            description: description,
            value: price,
            stock: stock,
        },
    });
}
const prisma = new client_1.PrismaClient();
