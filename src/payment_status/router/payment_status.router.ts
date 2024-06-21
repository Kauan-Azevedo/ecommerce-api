import express from "express";
import { PaymentStatusController } from "../controller/payment_status.controller";
import { PaymentStatusService } from "../services/payment_status.service";

const router = express.Router();
const paymentStatusService = new PaymentStatusService();
const paymentStatusController = new PaymentStatusController(paymentStatusService);


export default router;
