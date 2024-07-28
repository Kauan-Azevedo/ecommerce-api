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
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = __importDefault(require("util"));
const execPromise = util_1.default.promisify(child_process_1.exec);
const prisma = new client_1.PrismaClient();
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return prisma.permission.create({
                data: {
                    name: "Admin"
                }
            }).then((permission) => __awaiter(this, void 0, void 0, function* () {
                const userPassword = yield bcrypt_1.default.hash("unit_testing", 10);
                return prisma.user.create({
                    data: {
                        "email": "test.user@gmail.com",
                        "password": userPassword,
                        "id_permission": permission.id,
                        "first_name": "Test",
                        "last_name": "User",
                    }
                });
            })).then((user) => {
                return user;
            });
        }
        catch (error) {
            console.error('Failed to create admin user:', error);
            throw error;
        }
    });
}
function createNormalUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const permissionResponse = yield (0, supertest_1.default)(main_1.app).post("/permissions/create").send({
                name: "User"
            }).expect(201);
            const userResponse = yield (0, supertest_1.default)(main_1.app).post("/users/create").send({
                "email": "test.user@gmail.com",
                "password": "unit_testing",
                "confirm_password": "unit_testing",
                "id_permission": permissionResponse.body.id,
                "first_name": "Test",
                "last_name": "User"
            });
            return userResponse.body;
        }
        catch (error) {
            console.error('Failed to create a normal user:', error);
            throw error;
        }
    });
}
function authenticate(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield (0, supertest_1.default)(main_1.app)
            .post("/auth/login")
            .send({
            "email": username,
            "password": "unit_testing"
        });
        return token;
    });
}
describe("User API", () => {
    const user = {
        "email": "test.user@gmail.com",
        "password": "unit_testing",
        "confirm_password": "unit_testing",
        "id_permission": 1,
        "first_name": "Test",
        "last_name": "User"
    };
    const invalidUser = {
        "email": "invalid_email",
        "password": "unit_testing",
        "confirm_password": "unit_testing",
        "id_permission": 1,
        "first_name": "",
        "last_name": "User",
        "not_existing_field": "test"
    };
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
    it("Should get forbidden when getting a user by id without authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/users/1")
            .expect(403);
        expect(response.body).toEqual({
            error: "Not authenticated"
        });
    }));
    it("Should get forbidden when getting all the user without authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/users/")
            .expect(403);
        expect(response.body).toEqual({
            error: "Not authenticated"
        });
    }));
    it("Should get forbidden when creating a admin user without authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/createAdmin")
            .send(user)
            .expect(403);
        expect(response.body).toEqual({
            error: "Not authenticated"
        });
    }));
    it("Should get 404 when creating a user without a valid permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(user)
            .expect(404);
        expect(response.body).toEqual({
            "error": "Permission not found"
        });
    }));
    it("Should get 400 when trying to create a admin in the normal creation route", () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.permission.create({
            data: {
                name: "Admin"
            }
        });
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(user)
            .expect(400);
        expect(response.body).toEqual({
            error: "Can't create an Admin user"
        });
    }));
    it("Should validate the email when creating a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(Object.assign(Object.assign({}, user), { email: "invalid_email" }))
            .expect(400);
        expect(response.body).toEqual({
            error: "Invalid Email."
        });
    }));
    it("Should return 400 when creating a user with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(invalidUser)
            .expect(400);
        expect(response.body).toEqual({
            error: "Invalid payload provided."
        });
    }));
    it("Should return 404 when getting a user by id that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createNormalUser();
        const authenticatedUser = yield authenticate(user.email);
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/users/100")
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(404);
        expect(response.body).toEqual({
            error: "User not found"
        });
    }));
    it("should return 200 when authenticated getting a user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createNormalUser();
        const authenticatedUser = yield authenticate(user.email);
        const response = yield (0, supertest_1.default)(main_1.app)
            .get(`/users/${user.id}`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(200);
        expect(response.body.id).toEqual(user.id);
        expect(response.body.email).toEqual(user.email);
        expect(response.body.first_name).toEqual(user.first_name);
        expect(response.body.last_name).toEqual(user.last_name);
    }));
    it("should return 200 when authenticated getting all the users", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createNormalUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/users")
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].id).toEqual(user.id);
        expect(response.body[0].email).toEqual(user.email);
        expect(response.body[0].first_name).toEqual(user.first_name);
        expect(response.body[0].last_name).toEqual(user.last_name);
    }));
    it("Should return 201 when a user is created", () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.permission.create({
            data: {
                name: "User"
            }
        });
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(user)
            .expect(201);
        expect(response.body.email).toEqual(user.email);
        expect(response.body.first_name).toEqual(user.first_name);
        expect(response.body.last_name).toEqual(user.last_name);
        expect(response.body.id_permission).toEqual(user.id_permission);
    }));
    it("Should return forbidden when updating a user without authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/users/1")
            .send(user)
            .expect(403);
        expect(response.body).toEqual({
            error: "Not authenticated"
        });
    }));
    it("Should return forbidden when updating a user without permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createNormalUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .put(`/users/1`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .send(user)
            .expect(403);
        expect(response.body).toEqual({
            error: "Permission denied"
        });
    }));
    it("Should return 200 when a user is updated", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const updatedUser = {
            email: "atualizando@user.com.br",
            password: "unit_testing",
            id_permission: 1,
            first_name: "Atualizando",
            last_name: "User"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .put(`/users/${user.id}`)
            .send(updatedUser)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(200);
        expect(response.body.email).toEqual(updatedUser.email);
        expect(response.body.first_name).toEqual(updatedUser.first_name);
        expect(response.body.last_name).toEqual(updatedUser.last_name);
        expect(response.body.id_permission).toEqual(updatedUser.id_permission);
    }));
    it("Should return 404 when updating a user that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .put(`/users/100`)
            .send(user)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(404);
        expect(response.body).toEqual({
            error: "User not found"
        });
    }));
    it("Should return 404 when deleting a user that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete(`/users/100`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(404);
        expect(response.body).toEqual({
            error: "User not found"
        });
    }));
    it("Should return forbiden when deleting a user without authentication", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete("/users/1")
            .expect(403);
        expect(response.body).toEqual({
            error: "Not authenticated"
        });
    }));
    it("Should return forbidden when deleting a user without permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createNormalUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete(`/users/1`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(403);
        expect(response.body).toEqual({
            error: "Permission denied"
        });
    }));
    it("Should return 404 when deleting a user that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete(`/users/100`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(404);
        expect(response.body).toEqual({
            error: "User not found"
        });
    }));
    it("Should return 200 when deleting a user sucessfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete(`/users/${user.id}`)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.email).toEqual("test.user@gmail.com");
        expect(response.body.first_name).toEqual("Test");
        expect(response.body.last_name).toEqual("User");
    }));
    it("Should return 400 when trying to create a user with a bad payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/users/create")
            .send(invalidUser)
            .expect(400);
        expect(response.body).toEqual({
            error: "Invalid payload provided."
        });
    }));
    it("Should return 400 when trying to update a user with a bad payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createAdminUser();
        const authenticatedUser = yield authenticate("test.user@gmail.com");
        const response = yield (0, supertest_1.default)(main_1.app)
            .put(`/users/${user.id}`)
            .send(invalidUser)
            .set('Authorization', `Bearer ${authenticatedUser.body.token}`)
            .expect(400);
        expect(response.body).toEqual({
            error: "Invalid payload provided."
        });
    }));
});
