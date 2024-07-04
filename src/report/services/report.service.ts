import { prisma } from "@/db/prisma.service";

class ReportService {
  constructor() {}

  async getAllUnfinishedOrders() {
    return await prisma.order.findMany({
      where: {
        statusid: 1 || 2,
      },
    });
  }

  async getOrderByUserId(userId: number) {
    return await prisma.order.findMany({
      where: {
        userId: userId,
      },
    });
  }
}

export { ReportService };
