import { ProductService } from "../services/product.service";
import { Request, Response } from "express";

class ProductController {
  constructor(private readonly productService: ProductService) {}

  async getAll(req: Request, res: Response) {
    try {
      const products = await this.productService.getAll();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getById(id);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.update(id, req.body);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.productService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export { ProductController };
