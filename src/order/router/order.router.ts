import express from "express"
import { OrderService } from "../service/order.service"
import { OrderController } from "../controller/order.controller"

const router = express.Router()
const orderService = new OrderService()
const orderController = new OrderController(orderService)


///////////////////////////////////////////////////////////////////////
////////////////BASIC-CRUD-OPERATIONS///////////////////////
/////////////////////////////////////////////////////////////////////

//Post routes
router.post("/create", (req, res) => orderController.createOrder(req, res))

//Get routes
router.get("/", (req, res) => orderController.getAllOrders(req, res))
router.get("/:id", (req, res) => orderController.getOrderById(req, res))

//Put routes
router.put("/:id", (req, res) => orderController.updateOrder(req, res))

//Delete routes
router.delete("/:id", (req, res) => orderController.deleteOrder(req, res))


export default router