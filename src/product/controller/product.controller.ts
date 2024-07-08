import { PrismaError404 } from "prisma/middleware/errors/Prisma404";
import { ProductService } from "../services/product.service";
import { Request, Response } from "express";
import { PrismaError400 } from "prisma/middleware/errors/Prisma400";
import { Prisma } from "@prisma/client";
import { PrismaHttpError } from "prisma/middleware/errors/PrismaHttpError";
import prismaErrorHandler from "prisma/middleware/errorHandler";

class ProductController {
  constructor(private readonly productService: ProductService) { }

  isPayloadValid(payload: any) {
    if (!payload.name || !payload.value || !payload.stock || payload.name === "" || payload.value <= 0 || payload.stock < 0) {
      return false
    }
    return true
  }

  async getAll(req: Request, res: Response) {
    try {
      const products = await this.productService.getAll();

      if (products.length === 0) {
        throw new PrismaError404("No products found");
      }

      res.status(200).json(products);
    } catch (error: any) {
      this.productErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getById(id);

      if (!product) {
        throw new PrismaError404("Product not found");
      }

      res.status(200).json(product);
    } catch (error: any) {
      this.productErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async create(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("invalid payload provided.")
      }

      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      this.productErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!this.isPayloadValid(req.body)) {
        throw new PrismaError400("invalid payload provided.")
      }

      const id = parseInt(req.params.id);
      const product = await this.productService.update(id, req.body);

      if (!product) {
        throw new PrismaError404("Product not found");
      }

      res.status(200).json(product);
    } catch (error: any) {
      this.productErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deletedProduct = await this.productService.delete(id);

      if (!deletedProduct) {
        throw new PrismaError404("Product not found");
      }

      res.status(200).send();
    } catch (error: any) {
      this.productErrorHandler(error, req, res, prismaErrorHandler);
    }
  }

  productErrorHandler(
    error: any,
    req: Request,
    res: Response,
    next: Function,
  ) {

    if (error instanceof Prisma.PrismaClientValidationError) {
      error as Prisma.PrismaClientValidationError;
      return res.status(400).json({ error: "Invalid payload provided." });
    }

    if (error instanceof PrismaHttpError) {
      return res.status(error.code).json({ error: error.message });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error as Prisma.PrismaClientKnownRequestError;

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    next(error, req, res);
  }
}

export { ProductController };
