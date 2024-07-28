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
const supertest_1 = __importDefault(require("supertest"));
const main_1 = require("@/main");
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const execPromise = util_1.default.promisify(child_process_1.exec);
const prisma = new client_1.PrismaClient();
describe("product API", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.APPLICATION_DEV_MODE = "false";
        // Reset the database state before each test
        try {
            yield execPromise('npx prisma migrate reset --force');
            // Add any other necessary cleanup or seeding here
        }
        catch (error) {
            console.error('Failed to reset database:', error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
        main_1.server.close();
    }));
    it("should get 404 when getting a product by id that don't exits", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/products/1")
            .expect(404);
        expect(response.body).toEqual({
            error: "Product not found"
        });
    }));
    it("should get 404 when getting all products with no product created", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/products")
            .expect(404);
        expect(response.body).toEqual({
            error: "No products found"
        });
    }));
    it("should return 400 when inserting a product with a negative value", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: "Product 1",
            value: -10,
            stock: 10
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/products/create")
            .send(product)
            .expect(400);
        expect(response.body).toEqual({
            error: "invalid payload provided."
        });
    }));
    it("should return 400 when inserting a product with a negative stock", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: "Product 1",
            value: 10,
            stock: -10
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/products/create")
            .send(product)
            .expect(400);
        expect(response.body).toEqual({
            error: "invalid payload provided."
        });
    }));
    it("should return 400 when creating a product with an empty name", () => __awaiter(void 0, void 0, void 0, function* () {
        const product = {
            name: "",
            value: 10,
            stock: 10
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/products/create")
            .send(product)
            .expect(400);
        expect(response.body).toEqual({
            error: "invalid payload provided."
        });
    }));
});
it("should return 404 when updating a product that don't exits", () => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: "Product 1",
        value: 10,
        stock: 10
    };
    const response = yield (0, supertest_1.default)(main_1.app)
        .put("/products/1")
        .send(product)
        .expect(404);
    expect(response.body).toEqual({
        error: "Product not found"
    });
}));
it("should return 404 when deleting a product that don't exits", () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(main_1.app)
        .delete("/products/1")
        .expect(404);
    expect(response.body).toEqual({
        error: "Product not found"
    });
}));
it("should create a product", () => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: "Product 1",
        value: 10,
        stock: 10
    };
    const response = yield (0, supertest_1.default)(main_1.app)
        .post("/products/create")
        .send(product)
        .expect(201);
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual("Product 1");
    expect(response.body.value).toEqual(10);
    expect(response.body.stock).toEqual(10);
}));
it("should update a product", () => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: "Product 1",
        value: 10,
        stock: 10
    };
    yield (0, supertest_1.default)(main_1.app)
        .post("/products/create")
        .send(product)
        .expect(201);
    const updatedProduct = {
        name: "Product 2",
        value: 20,
        stock: 20
    };
    const response = yield (0, supertest_1.default)(main_1.app)
        .put("/products/1")
        .send(updatedProduct)
        .expect(200);
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual("Product 2");
    expect(response.body.value).toEqual(20);
    expect(response.body.stock).toEqual(20);
}));
it("should delete a product", () => __awaiter(void 0, void 0, void 0, function* () {
    const product = {
        name: "Product 1",
        value: 10,
        stock: 10
    };
    yield (0, supertest_1.default)(main_1.app)
        .post("/products/create")
        .send(product)
        .expect(201);
    const response = yield (0, supertest_1.default)(main_1.app)
        .delete("/products/1")
        .expect(200);
    expect(response.body).toEqual({});
}));
