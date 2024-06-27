import express from "express";
import { ProductController } from "../controller/product.controller";
import { ProductService } from "../services/product.service";

const router = express.Router();
const productService = new ProductService(); // Instanciando o serviço
const productController = new ProductController(productService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Product Name"
 *         description:
 *           type: string
 *           example: "Product Description"
 *         value:
 *           type: number
 *           example: 29.99
 *         stock:
 *           type: integer
 *           example: 100
 *   requestBodies:
 *     ProductBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *   responses:
 *     ProductResponse:
 *       description: A Product object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     NotFound:
 *       description: The Product was not found
 *     Invalid:
 *       description: Invalid data
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       $ref: '#/components/requestBodies/ProductBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/", productController.create.bind(productController));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.get("/", productController.getAll.bind(productController));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.get("/:id", productController.getById.bind(productController));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       $ref: '#/components/requestBodies/ProductBody'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.put("/:id", productController.update.bind(productController));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/ProductResponse'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.delete("/:id", productController.delete.bind(productController));

export default router;
