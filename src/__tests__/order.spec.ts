import request from 'supertest';
import { app, server } from '@/main';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

const prisma = new PrismaClient();

const seedData = async () => {
    // Seed necessary data
    const product = {
        name: "test product",
        description: "this is the product from the test",
        value: 100,
        stock: 100
    }
    const paymentMethod = { name: "Test payment Method" };
    const paymentStatus = { name: "Test payment Status" };
    const permission = { name: "Admin" };
    const status = { name: "Test status" }

    const user = {
        first_name: "test",
        last_name: "user",
        email: "test.user@example.com",
        phone_number: "123-123-123",
        password: "password123",
        id_permission: 1
    }

    await request(app)
        .post('/products')
        .send(product)
        .expect(201);

    await request(app)
        .post('/paymentmethod/create')
        .send(paymentMethod)
        .expect(201);

    await request(app)
        .post('/paymentstatus/create')
        .send(paymentStatus)
        .expect(201);

    await request(app)
        .post('/permissions')
        .send(permission)
        .expect(201);

    await request(app)
        .post('/users')
        .send(user)
        .expect(201);

    await request(app)
        .post('/status')
        .send(status)
        .expect(201);
}

describe('Order API', () => {
    beforeEach(async () => {
        // Reset the database state before each test
        try {
            await execPromise('npx prisma migrate reset --force');
            // Add any other necessary cleanup or seeding here
        } catch (error) {
            console.error('Failed to reset database:', error);
        }
    });

    afterAll(async () => {
        server.close();
        await prisma.$disconnect();
    });

    describe('POST /orders', () => {
        it('should create an order and decrease product stock', async () => {
            await seedData();

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

            const response = await request(app)
                .post('/orders/create')
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('orderInfos');
            expect(response.body.orderInfos).toHaveLength(1);
            expect(response.body.orderInfos[0]).toHaveProperty('productId', 1);
            expect(response.body.orderInfos[0]).toHaveProperty('quantity', 1);

            const updatedProduct = await prisma.product.findUnique({ where: { id: 1 } });
            expect(updatedProduct).toHaveProperty('stock', 99);
        }
        )
    });
});

describe('PUT /orders/:id', () => {
    it('should update an order and adjust product stock accordingly', async () => {
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

        const order = await request(app)
            .post('/orders/create')
            .send(orderData)
            .expect(201);

        const response: any = await request(app)
            .put(`/orders/${order.body.id}`)
            .send(updatedOrderData)
            .expect(200);

        expect(response.body).toHaveProperty('id', response.body.id);
        expect(response.body).toHaveProperty('orderInfos');
        expect(response.body.orderInfos).toHaveLength(1);
        expect(response.body.orderInfos[0]).toHaveProperty('productId', 1);
        expect(response.body.orderInfos[0]).toHaveProperty('quantity', 2);

        const updatedProduct = await prisma.product.findUnique({ where: { id: 1 } });
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

        const responseDecrease = await request(app)
            .put(`/orders/${response.body.id}`)
            .send(updatedOrderDataDecrease)
            .expect(200);

        expect(responseDecrease.body).toHaveProperty('id', response.body.id + 1);
        expect(responseDecrease.body).toHaveProperty('orderInfos');
        expect(responseDecrease.body.orderInfos).toHaveLength(1);
        expect(responseDecrease.body.orderInfos[0]).toHaveProperty('productId', 1);
        expect(responseDecrease.body.orderInfos[0]).toHaveProperty('quantity', 1);

        const updatedProductDecrease = await prisma.product.findUnique({ where: { id: 1 } });
        expect(updatedProductDecrease).toHaveProperty('stock', 98);
    });
});

describe('DELETE /orders/:id', () => {
    it('should delete an order and return items to stock', async () => {
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

        const order = await request(app)
            .post('/orders/create')
            .send(orderData)
            .expect(201);

        await request(app)
            .delete(`/orders/${order.body.id}`)
            .expect(204);

        const updatedProduct = await prisma.product.findUnique({ where: { id: order.body.orderInfos[0].productId } });
        expect(updatedProduct).toHaveProperty('stock', 98);
    });
});

describe('GET /orders', () => {
    it('should get all orders', async () => {
        const response = await request(app).get('/orders').expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
            expect.objectContaining({ id: 4 }),
        ]));
    });
});

describe("GET /orders/:id", () => {
    it("should get an order by id", async () => {
        const response = await request(app).get("/orders/1").expect(200);

        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("orderInfos");
        expect(response.body.orderInfos).toHaveLength(1);
        expect(response.body.orderInfos[0]).toHaveProperty("productId", 1);
        expect(response.body.orderInfos[0]).toHaveProperty("quantity", 1);
        expect(response.body).toHaveProperty("paymentMethodId", 1);
        expect(response.body).toHaveProperty("paymentStatusId", 1);
        expect(response.body).toHaveProperty("statusid", 1);
        expect(response.body).toHaveProperty("userId", 1);
    });
});

describe("GET /orders/user/:id", () => {
    it("should get orders by user id", async () => {
        const response = await request(app).get("/orders/user/1").expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    });
});

describe("GET /orders/payment-status/:id", () => {
    it("should get orders by payment status id", async () => {
        const response = await request(app).get("/orders/payment-status/1").expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    });
})

describe("GET /orders/payment-method/:id", () => {
    it("should get orders by payment method id", async () => {
        const response = await request(app).get("/orders/payment-method/1").expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
        ]));
    });
})