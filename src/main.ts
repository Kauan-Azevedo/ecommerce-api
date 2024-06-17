import express, { Request, Response } from "express";
import { sequelize } from "./db/db.config";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import usersRotuer from "./user/router/user.router";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "Lorem ipsum",
    },
  },
  apis: ["./src/**/*.router.ts"],
};
const specs = swaggerJsdoc(options);
const app = express();
const port = 3000;

// oi

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routers
app.use("/users", usersRotuer);

// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Ecommerce API!");
});

// Sincronização do Sequelize
sequelize.sync();

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
});
