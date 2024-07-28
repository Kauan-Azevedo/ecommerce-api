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
describe("Payment Method API", () => {
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
    it("should get a payment method by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/paymentmethod/1")
            .expect(404);
        expect(response.body).toEqual({
            error: "Payment method not found"
        });
    }));
    it("should get all payment methods", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/paymentmethod")
            .expect(404);
        expect(response.body).toEqual({
            error: "No found any payment methods"
        });
    }));
    it("should create a payment method", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: "Test payment Method 1"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/paymentmethod/create")
            .send(paymentMethod)
            .expect(201);
        expect(response.body.id).toEqual(1);
        expect(response.body.name).toEqual("Test payment Method 1");
    }));
    it("should return 400 when creating a payment method with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: "",
            description: "Description field don't exist in the model"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/paymentmethod/create")
            .send(paymentMethod)
            .expect(400);
        expect(response.body).toEqual({ "error": "Invalid payload provided." });
    }));
    it("should return 400 when creating a payment method with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: ""
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/paymentmethod/create")
            .send(paymentMethod)
            .expect(400);
        expect(response.body).toEqual({ "error": "Invalid payload provided." });
    }));
    it("should return 404 when getting a payment method by id that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/paymentmethod/2")
            .expect(404);
        expect(response.body).toEqual({ "error": "Payment method not found" });
    }));
    it("should return 400 when updating a payment method with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: ""
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/paymentmethod/1")
            .send(paymentMethod)
            .expect(400);
        expect(response.body).toEqual({ "error": "Invalid payload provided." });
    }));
    it("should return 404 when updating a payment method that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: "Updated payment method"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/paymentmethod/100")
            .send(paymentMethod)
            .expect(404);
        expect(response.body).toEqual({ "error": "Payment method not found" });
    }));
    it("should return 404 when deleting a payment method that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete("/paymentmethod/100")
            .expect(404);
        expect(response.body).toEqual({ "error": "Payment method not found" });
    }));
    it("should delete a payment method", () => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = {
            name: "Test payment Method 1"
        };
        yield (0, supertest_1.default)(main_1.app)
            .post("/paymentmethod/create")
            .send(paymentMethod)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete("/paymentmethod/1")
            .expect(200);
        expect(response.body.deletedAt).not.toBeNull();
    }));
});
