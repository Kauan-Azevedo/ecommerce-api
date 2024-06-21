import makeDatabaseUrl from './utils/make-databaseurl'

import express, { Request, Response } from "express"
// import { sequelize } from "./db/db.config"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

// Importing Routers
import usersRouter from "./user/router/user.router"
import paymentStatusRouter from "./payment_status/router/paymentStatus.router"
import paymentMethodRouter from "./payment_method/router/paymentMethod.router"
import orderRouter from "./order/router/order.router"

makeDatabaseUrl()

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "Esta aplicação é um projeto de backend para um sistema de e-commerce, \
      desenvolvido como parte de uma avaliação (N3) para um cenário fictício onde os desenvo\
      lvedores trabalham para uma startup. \n\nO objetivo é implementar uma API Rest que atenda \
      aos requisitos fornecidos pelo cliente, para posterior implantação no servidor do cliente. O \
      projeto é colaborativo, com tarefas divididas entre os membros da equipe, cada um \
      responsável por diferentes aspectos do sistema, incluindo modelos de dados como \
      User, Permissions, Product, Order, Payment_method, e Payment_status, além de end\
      points para CRUD (Create, Read, Update, Delete) desses modelos e funcionalidades \
      específicas como controle de acesso baseado em Permissions, integração de métodos \
      de pagamento, e desenvolvimento de endpoints de relatórios.\n\nOs critérios de avaliação \
      para o projeto incluem funcionalidade (todos os endpoints devem estar funcionando), \
      validação (controle de exceção para erros 400 e validação de campos obrigatórios), arquitetura \
      (uso das camadas de Routers, Controllers, Services, e Models, com persistência no banco de dados \
      relacional via Prisma), e qualidade do código (organização, otimização e documentação).Além disso, \
      o projeto também envolve a implementação de Docker para desenvolvimento, supervisão e logging \
      de atividades nos endpoints, e a escrita de testes unitários para garantir a cobertura de testes para \
      todos os endpoints, configurando um ambiente de testes e integração contínua.\n\nA divisão de tarefas \
      entre os integrantes da equipe é detalhada, com responsabilidades específicas atribuídas a cada membro, \
      incluindo a implementação de modelos e endpoints específicos, desenvolvimento de testes unitários, e \
      supervisão geral dos endpoints.",
    },
  },
  apis: ["./src/**/*.router.ts"],
}
const specs = swaggerJsdoc(options)
const app = express()
const port = 3000

// oi
// bom dia princesa 😘

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

///////////////////////////////////////////////////////////////////////////
//////////////////////////ROUTES//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

//Users routes
app.use("/users", usersRouter)

//Payment status routes
app.use("/paymentstatus", paymentStatusRouter)

//Payment method routes
app.use("/paymentmethod", paymentMethodRouter)

//Order routes
app.use("/order", orderRouter)

// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Ecommerce API!")
})

// Sincronização do Sequelize
// sequelize.sync()

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port} 🚀`)
})
