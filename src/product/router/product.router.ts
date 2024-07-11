import express from "express";
import { ProductController } from "../controller/product.controller";
import { ProductService } from "../services/product.service";

const router = express.Router();
const productService = new ProductService();
const productController = new ProductController(productService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - value
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         value:
 *           type: number
 *           description: The value of the product
 *         stock:
 *           type: integer
 *           description: The stock amount of the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was last updated
 *       example:
 *         id: 1
 *         name: "Product Name"
 *         value: 29.99
 *         stock: 100
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 *   requestBodies:
 *     ProductBody:
 *       description: A product object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *   responses:
 *     ProductResponse:
 *       description: A product object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     NotFound:
 *       description: The product was not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: Product not found
 *     Invalid:
 *       description: Invalid data
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: invalid payload provided.
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       $ref: '#/components/requestBodies/ProductBody'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/Invalid'
 */
router.post("/create", productController.create.bind(productController));

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No products found
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
 *           example: 1
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *         $ref: '#/components/responses/NotFound'
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
 *           example: 1
 *     requestBody:
 *       $ref: '#/components/requestBodies/ProductBody'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *         $ref: '#/components/responses/NotFound'
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
 *           example: 1
 *     responses:
 *       200:
 *         description: The product was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: The product was not found
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", productController.delete.bind(productController));

export default router;