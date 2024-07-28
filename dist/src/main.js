"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const errorHandler_1 = __importDefault(require("../prisma/middleware/errorHandler"));
const server_1 = __importDefault(require("./server"));
// Importing Routers
const user_router_1 = __importDefault(require("./user/router/user.router"));
const paymentStatus_router_1 = __importDefault(require("./payment_status/router/paymentStatus.router"));
const paymentMethod_router_1 = __importDefault(require("./payment_method/router/paymentMethod.router"));
const auth_router_1 = __importDefault(require("./auth/router/auth.router"));
const permission_router_1 = __importDefault(require("./permission/router/permission.router"));
const order_router_1 = __importDefault(require("./order/router/order.router"));
const product_router_1 = __importDefault(require("./product/router/product.router"));
const status_router_1 = __importDefault(require("./status/router/status.router"));
const report_router_1 = __importDefault(require("./report/router/report.router"));
// Importing Swagger Options
const swagger_options_1 = require("./utils/swagger-options");
const morgan_1 = __importDefault(require("morgan"));
const specs = (0, swagger_jsdoc_1.default)(swagger_options_1.options);
const app = (0, express_1.default)();
exports.app = app;
const port = Number(process.env.APPLICATION_PORT) || Number(3000);
const isDev = Boolean(process.env.APPLICATION_DEV_MODE) === true;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Config middlewares and app stuff////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(errorHandler_1.default);
if (isDev) {
    app.use((0, morgan_1.default)("dev"));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Setup routers/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use("/users", user_router_1.default);
app.use("/paymentstatus", paymentStatus_router_1.default);
app.use("/paymentmethod", paymentMethod_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/permissions", permission_router_1.default);
app.use("/orders", order_router_1.default);
app.use("/products", product_router_1.default);
app.use("/status", status_router_1.default);
app.use("/report", report_router_1.default);
// Rota inicial
app.get("/", (req, res) => {
    res.send("Welcome to Ecommerce API! Go to <strong><a href='/api-docs'>/api-docs</a></strong> to see the documentation");
});
// Iniciar o servidor
const server = (0, server_1.default)(app, port, isDev);
exports.server = server;
