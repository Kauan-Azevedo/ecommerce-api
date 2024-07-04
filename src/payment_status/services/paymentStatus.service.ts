import { prisma } from "@/db/prisma.service";
import { PaymentStatus } from ".prisma/client";

class PaymentStatusService {
  async createPaymentStatus(status: PaymentStatus) {
    return await prisma.paymentStatus.create({ data: status });
  }

  async getPaymentStatusById(id: number) {
    return await prisma.paymentStatus.findUnique({ where: { id } });
  }

  async getAllPaymentStatuses() {
    return await prisma.paymentStatus.findMany();
  }

  async updatePaymentStatus(id: number, status: PaymentStatus) {
    return await prisma.paymentStatus.update({ where: { id }, data: status });
  }

  async deletePaymentStatus(id: number) {
    return await prisma.paymentStatus.delete({ where: { id } });
  }
}

export { PaymentStatusService };
