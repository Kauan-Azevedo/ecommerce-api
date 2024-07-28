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
exports.ProductController = void 0;
const Prisma404_1 = require("prisma/middleware/errors/Prisma404");
const Prisma400_1 = require("prisma/middleware/errors/Prisma400");
const client_1 = require("@prisma/client");
const PrismaHttpError_1 = require("prisma/middleware/errors/PrismaHttpError");
const errorHandler_1 = __importDefault(require("prisma/middleware/errorHandler"));
class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    isPayloadValid(payload) {
        if (!payload.name || !payload.value || !payload.stock || payload.name === "" || payload.value <= 0 || payload.stock < 0) {
            return false;
        }
        return true;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productService.getAll();
                if (products.length === 0) {
                    throw new Prisma404_1.PrismaError404("No products found");
                }
                res.status(200).json(products);
            }
            catch (error) {
                this.productErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const product = yield this.productService.getById(id);
                if (!product) {
                    throw new Prisma404_1.PrismaError404("Product not found");
                }
                res.status(200).json(product);
            }
            catch (error) {
                this.productErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("invalid payload provided.");
                }
                const product = yield this.productService.create(req.body);
                res.status(201).json(product);
            }
            catch (error) {
                this.productErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.isPayloadValid(req.body)) {
                    throw new Prisma400_1.PrismaError400("invalid payload provided.");
                }
                const id = parseInt(req.params.id);
                const product = yield this.productService.update(id, req.body);
                if (!product) {
                    throw new Prisma404_1.PrismaError404("Product not found");
                }
                res.status(200).json(product);
            }
            catch (error) {
                this.productErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const deletedProduct = yield this.productService.delete(id);
                if (!deletedProduct) {
                    throw new Prisma404_1.PrismaError404("Product not found");
                }
                res.status(200).send();
            }
            catch (error) {
                this.productErrorHandler(error, req, res, errorHandler_1.default);
            }
        });
    }
    productErrorHandler(error, req, res, next) {
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
                return res.status(404).json({ error: "Product not found" });
            }
        }
        next(error, req, res);
    }
}
exports.ProductController = ProductController;
