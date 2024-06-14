import express, { Request, Response } from 'express';
import { sequelize } from './db/db.config';
import bodyParser from 'body-parser';
import cors from "cors";
import morgan from 'morgan';
// import usersRouter from './users/router/users.router';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Routers
// app.use('/users', usersRouter);


// Rota inicial
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Ecommerce API!');
});

// Sincronização do Sequelize
sequelize.sync();

// Iniciar o servidor
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
});