import express from "express";
import { DummyController } from "../controller/dummy.controller";
import { DummyService } from "../services/dummy.service";

const router = express.Router();
const dummyService = new DummyService(); // Instanciando o serviço
const dummyController = new DummyController(dummyService);

// Your routes here

export default router;