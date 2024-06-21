import express from "express"
import { PaymentStatusController } from "../controller/paymentStatus.controller"
import { PaymentStatusService } from "../services/paymentStatus.service"

const router = express.Router()
const paymentStatusService = new PaymentStatusService()
const paymentStatusController = new PaymentStatusController(paymentStatusService)

//Post routes
router.post("/create", (req, res) => paymentStatusController.createPaymentStatus(req, res))

//Get routes
router.get("/", (req, res) => paymentStatusController.getAllPaymentStatuses(req, res))
router.get("/:id", (req, res) => paymentStatusController.getPaymentStatusById(req, res))

//Put routes
router.put("/:id", (req, res) => paymentStatusController.updatePaymentStatus(req, res))

//Delete routes
router.delete("/:id", (req, res) => paymentStatusController.deletePaymentStatus(req, res))

export default router
