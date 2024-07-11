import { prisma } from "@/db/prisma.service";

class ProductService {
  constructor() { }

  async getAll() {
    return await prisma.product.findMany();
  }

  async getById(id: number) {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data: any) {
    return await prisma.product.create({
      data: data,
    });
  }

  async update(id: number, data: any) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async delete(id: number) {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export { ProductService };
