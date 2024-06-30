import express from "express";
import { ReportController } from "../controller/report.controller";
import { ReportService } from "../services/report.service";

const router = express.Router();
const reportService = new ReportService(); // Instanciando o serviço
const reportController = new ReportController(reportService);

// Your routes here

export default router;