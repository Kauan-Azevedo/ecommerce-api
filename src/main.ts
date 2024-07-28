import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import prismaErrorHandler from "../prisma/middleware/errorHandler";
import runServer from "./server";

// Importing Routers
import usersRouter from "./user/router/user.router";
import paymentStatusRouter from "./payment_status/router/paymentStatus.router";
import paymentMethodRouter from "./payment_method/router/paymentMethod.router";
import authRouter from "./auth/router/auth.router";
import permissionRouter from "./permission/router/permission.router";
import orderRouter from "./order/router/order.router";
import productRouter from "./product/router/product.router";
import statusRouter from "./status/router/status.router";
import reportRouter from "./report/router/report.router";

// Importing Swagger Options
import { options } from "./utils/swagger-options";
import morgan from "morgan";

const specs = swaggerJsdoc(options);
const app = express();
const port = Number(process.env.APPLICATION_PORT) || Number(3000);
const isDev = Boolean(process.env.APPLICATION_DEV_MODE) === true;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Config middlewares and app stuff////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(prismaErrorHandler);
if (isDev) {
  app.use(morgan("dev"));
}

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
app.use("/status", statusRouter);
app.use("/report", reportRouter);

// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to E-commerce API! Go to <strong><a href='/api-docs'>/api-docs</a></strong> to see the documentation",
  );
});

// Iniciar o servidor
const server = runServer(app, port, isDev);

export { server, app };
