import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "ecommerce_api",
    schema: process.env.DB_SCHEMA || "public",
    logging: false,
    define: {
        timestamps: true,
    },
});

export { sequelize };
