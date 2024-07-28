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
describe("Permission API", () => {
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
    it("should receive 404 when trying to get a permission by id that don't exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/permissions/1")
            .expect(404);
        expect(response.body).toEqual({
            error: "Permission not found"
        });
    }));
    it("should receive 404 when trying to get all permissions and there is none", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/permissions")
            .expect(404);
        expect(response.body).toEqual({
            error: "Permissions not found"
        });
    }));
    it("should receive 404 when trying to update a permission that don't exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/permissions/1")
            .send({ name: "Test permission" })
            .expect(404);
        expect(response.body).toEqual({
            error: "Permission not found"
        });
    }));
    it("should receive 404 when trying to delete a permission that don't exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete("/permissions/1")
            .expect(404);
        expect(response.body).toEqual({
            error: "Permission not found"
        });
    }));
    it("should receive 400 when trying to create a permission with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: ""
        };
        const permissionWrongField = {
            name: "",
            description: "Test description"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(400);
        const responseWrongField = yield (0, supertest_1.default)(main_1.app)
            .put("/permissions/create")
            .send(permissionWrongField)
            .expect(400);
        expect(response.body).toEqual({ "error": "Invalid payload provided." });
        expect(responseWrongField.body).toEqual({ "error": "Invalid payload provided." });
    }));
    it("should receive 400 when trying to update a permission with invalid payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: ""
        };
        const permissionWrongField = {
            name: "",
            description: "Test description"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/permissions/1")
            .send(permission)
            .expect(400);
        const responseWrongField = yield (0, supertest_1.default)(main_1.app)
            .put("/permissions/1")
            .send(permissionWrongField)
            .expect(400);
        expect(response.body).toEqual({ "error": "Invalid payload provided." });
        expect(responseWrongField.body).toEqual({ "error": "Invalid payload provided." });
    }));
    it("should create a permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: "Test permission"
        };
        const response = yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(201);
        expect(response.body.name).toEqual("Test permission");
        expect(response.body.id).toEqual(1);
    }));
    it("should get all permissions", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: "Test permission"
        };
        yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/permissions")
            .expect(200);
        expect(response.body.length).toEqual(1);
        expect(response.body[0].name).toEqual("Test permission");
    }));
    it("should get a permission by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: "Test permission"
        };
        yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .get("/permissions/1")
            .expect(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.name).toEqual("Test permission");
    }));
    it("should update a permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: "Test permission"
        };
        yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .put("/permissions/1")
            .send({ name: "Updated permission" })
            .expect(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.name).toEqual("Updated permission");
    }));
    it("should delete a permission", () => __awaiter(void 0, void 0, void 0, function* () {
        const permission = {
            name: "Test permission"
        };
        yield (0, supertest_1.default)(main_1.app)
            .post("/permissions/create")
            .send(permission)
            .expect(201);
        const response = yield (0, supertest_1.default)(main_1.app)
            .delete("/permissions/1")
            .expect(200);
        expect(response.body.id).toEqual(1);
        expect(response.body.deletedAt).not.toBeNull();
    }));
});
