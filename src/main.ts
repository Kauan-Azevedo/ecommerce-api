import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import prismaErrorHandler from "../prisma/middleware/errorHandler";

// Importing Routers
import usersRouter from "./user/router/user.router";
import paymentStatusRouter from "./payment_status/router/paymentStatus.router";
import paymentMethodRouter from "./payment_method/router/paymentMethod.router";
import authRouter from "./auth/router/auth.router";
import permissionRouter from "./permission/router/permission.router";
import orderRouter from "./order/router/order.router";
import productRouter from "./product/router/product.router";

// Importing Swagger Options
import { options } from "./utils/swagger-options";

const specs = swaggerJsdoc(options);
const app = express();
const port = 3000;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Config middlewares and app stuff////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(prismaErrorHandler);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////Setup routers/////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use("/users", usersRouter);
app.use("/paymentstatus", paymentStatusRouter);
app.use("/paymentmethod", paymentMethodRouter);
app.use("/auth", authRouter);
app.use("/permissions", permissionRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);

// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Ecommerce API! Go to <strong><a href='/api-docs'>/api-docs</a></strong> to see the documentation");
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
});
