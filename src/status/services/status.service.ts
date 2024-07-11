import { prisma } from "@/db/prisma.service";

class StatusService {
  async getAll() {
    return await prisma.status.findMany();
  }

  async getById(id: number) {
    return await prisma.status.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(data: any) {
    return await prisma.status.create({
      data: data,
    });
  }

  async update(id: number, data: any) {
    return await prisma.status.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  async delete(id: number) {
    return await prisma.status.update(
      {
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      },
    )
  }
}

export { StatusService };
