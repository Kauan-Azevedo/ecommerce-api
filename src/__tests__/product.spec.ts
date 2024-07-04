import { Request, Response } from "express";
import { ProductService } from "../product/services/product.service";
import { ProductController } from "../product/controller/product.controller";

describe("ProductController", () => {
  let productService: ProductService;
  let productController: ProductController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    productService = new ProductService();
    productController = new ProductController(productService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    res.send = jest.fn();
  });

  describe("getAll", () => {
    it("should return all products", async () => {
      const products = [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ];
      productService.getAll = jest.fn().mockResolvedValue(products);

      await productController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it("should handle errors and return 500 status code", async () => {
      const errorMessage = "Internal server error";
      productService.getAll = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await productController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe("getById", () => {
    it("should return a product by id", async () => {
      const id = 1;
      const product = { id, name: "Product 1" };
      productService.getById = jest.fn().mockResolvedValue(product);
      req.params = { id: id.toString() };

      await productController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it("should handle errors and return 500 status code", async () => {
      const id = 1;
      const errorMessage = "Internal server error";
      productService.getById = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));
      req.params = { id: id.toString() };

      await productController.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
