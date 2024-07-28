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
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.user.create({
            data: {
                "email": "test.user@gmail.com",
                "password": "unit_testing",
                "id_permission": 1,
                "first_name": "Test",
                "last_name": "User",
            }
        });
    });
}
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Seed necessary data
    const product = {
        name: "test product",
        description: "this is the product from the test",
        value: 100,
        stock: 100
    };
    const paymentMethod = { name: "Test payment Method" };
    const paymentStatus = { name: "Test payment Status" };
    const permission = { name: "Admin" };
    const status = { name: "Test status" };
    yield (0, supertest_1.default)(main_1.app)
        .post('/products/create')
        .send(product)
        .expect(201);
    yield (0, supertest_1.default)(main_1.app)
        .post('/paymentmethod/create')
        .send(paymentMethod)
        .expect(201);
    yield (0, supertest_1.default)(main_1.app)
        .post('/paymentstatus/create')
        .send(paymentStatus)
        .expect(201);
    yield (0, supertest_1.default)(main_1.app)
        .post('/permissions/create')
        .send(permission)
        .expect(201);
    yield (0, supertest_1.default)(main_1.app)
        .post('/status/create')
        .send(status)
        .expect(201);
    yield createAdminUser();
});
describe('Order API', () => {
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
        main_1.server.close();
        yield prisma.$disconnect();
    }));
    describe('POST /orders', () => {
        it('should create an order and decrease product stock', () => __awaiter(void 0, void 0, void 0, function* () {
            yield seedData();
            const orderData = {
                paymentMethodId: 1,
                paymentStatusId: 1,
                statusid: 1,
                userId: 1,
                description: 'Test order',
                orderItems: [
                    {
                        productId: 1,
                        quantity: 1,
                    },
                ],
            };
            const response = yield (0, supertest_1.default)(main_1.app)
                .post('/orders/create')
                .send(orderData)
                .expect(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('orderInfos');
            expect(response.body.orderInfos).toHaveLength(1);
            expect(response.body.orderInfos[0]).toHaveProperty('productId', 1);
            expect(response.body.orderInfos[0]).toHaveProperty('quantity', 1);
            const updatedProduct = yield prisma.product.findUnique({ where: { id: 1 } });
            expect(updatedProduct).toHaveProperty('stock', 99);
        }));
    });
});
describe('PUT /orders/:id', () => {
    it('should update an order and adjust product stock accordingly', () => __awaiter(void 0, void 0, void 0, function* () {
        const orderData = {
            paymentMethodId: 1,
            paymentStatusId: 1,
            statusid: 1,
            userId: 1,
            description: 'Test order',
            orderItems: [
                {
                    productId: 1,
                    quantity: 1,
                },
            ],
        };
        const updatedOrderData = {
            paymentMethodId: 1,
            paymentStatusId: 1,
            statusid: 1,
            userId: 1,
            description: 'Updated order',
            orderItems: [
                {
                    productId: 1,
                    quantity: 2,
                },
            ],
        };
        const order = yield (0, supertest_1.default)(main_1.app)
            .post('/orders/create')
            .send(orderData)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .put(`/orders/${order.body.id}`)
            .send(updatedOrderData)
            .expect(200);
        expect(response.body).toHaveProperty('id', response.body.id);
        expect(response.body).toHaveProperty('orderInfos');
        expect(response.body.orderInfos).toHaveLength(1);
        expect(response.body.orderInfos[0]).toHaveProperty('productId', 1);
        expect(response.body.orderInfos[0]).toHaveProperty('quantity', 2);
        const updatedProduct = yield prisma.product.findUnique({ where: { id: 1 } });
        expect(updatedProduct).toHaveProperty('stock', 97);
        const updatedOrderDataDecrease = {
            paymentMethodId: 1,
            paymentStatusId: 1,
            statusid: 1,
            userId: 1,
            description: 'Updated order',
            orderItems: [
                {
                    productId: 1,
                    quantity: 1,
                },
            ],
        };
        const responseDecrease = yield (0, supertest_1.default)(main_1.app)
            .put(`/orders/${response.body.id}`)
            .send(updatedOrderDataDecrease)
            .expect(200);
        expect(responseDecrease.body).toHaveProperty('id', response.body.id + 1);
        expect(responseDecrease.body).toHaveProperty('orderInfos');
        expect(responseDecrease.body.orderInfos).toHaveLength(1);
        expect(responseDecrease.body.orderInfos[0]).toHaveProperty('productId', 1);
        expect(responseDecrease.body.orderInfos[0]).toHaveProperty('quantity', 1);
        const updatedProductDecrease = yield prisma.product.findUnique({ where: { id: 1 } });
        expect(updatedProductDecrease).toHaveProperty('stock', 98);
    }));
});
describe('DELETE /orders/:id', () => {
    it('should delete an order and return items to stock', () => __awaiter(void 0, void 0, void 0, function* () {
        const orderData = {
            paymentMethodId: 1,
            paymentStatusId: 1,
            statusid: 1,
            userId: 1,
            description: 'Test order',
            orderItems: [
                {
                    productId: 1,
                    quantity: 1,
                },
            ],
        };
        const order = yield (0, supertest_1.default)(main_1.app)
            .post('/orders/create')
            .send(orderData)
            .expect(201);
        yield (0, supertest_1.default)(main_1.app)
            .delete(`/orders/${order.body.id}`)
            .expect(204);
        const updatedProduct = yield prisma.product.findUnique({ where: { id: order.body.orderInfos[0].productId } });
        expect(updatedProduct).toHaveProperty('stock', 98);
    }));
});
describe('GET /orders', () => {
    it('should get all orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app).get('/orders').expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
            expect.objectContaining({ id: 4 }),
        ]));
    }));
});
describe("GET /orders/:id", () => {
    it("should get an order by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app).get("/orders/1").expect(200);
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("orderInfos");
        expect(response.body.orderInfos).toHaveLength(1);
        expect(response.body.orderInfos[0]).toHaveProperty("productId", 1);
        expect(response.body.orderInfos[0]).toHaveProperty("quantity", 1);
        expect(response.body).toHaveProperty("paymentMethodId", 1);
        expect(response.body).toHaveProperty("paymentStatusId", 1);
        expect(response.body).toHaveProperty("statusid", 1);
        expect(response.body).toHaveProperty("userId", 1);
    }));
});
describe("GET /orders/user/:id", () => {
    it("should get orders by user id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app).get("/orders/user/1").expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    }));
});
describe("GET /orders/payment-status/:id", () => {
    it("should get orders by payment status id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app).get("/orders/payment-status/1").expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    }));
});
describe("GET /orders/payment-method/:id", () => {
    it("should get orders by payment method id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app).get("/orders/payment-method/1").expect(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    }));
});
