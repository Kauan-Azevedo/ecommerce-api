import { prisma } from "@/db/prisma.service"
import { PaymentStatus } from ".prisma/client"
import { Prisma } from '@prisma/client';

class PaymentStatusService {
  async createPaymentStatus(status: PaymentStatus) {
    try {
      const record = await prisma.paymentStatus.findFirst({ where: { name: status.name } })

      if (record) {
        throw new Error(`Payment status with name ${status.name} already exists.`);
      }

      return await prisma.paymentStatus.create({ data: status })

    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async getPaymentStatusById(id: number) {
    try {
      return await prisma.paymentStatus.findUnique({ where: { id } })
    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async getAllPaymentStatuses() {
    try {
      return await prisma.paymentStatus.findMany()
    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async updatePaymentStatus(id: number, status: PaymentStatus) {
    try {
      const record = await prisma.paymentStatus.update({ where: { id }, data: status })

      if (!record) {
        throw new Error(`Payment status with ID ${id} not found on update.`);
      }

      return record

    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async deletePaymentStatus(id: number) {
    try {
      const record = await prisma.paymentStatus.findUnique({ where: { id } });

      if (!record) {
        throw new Error(`Payment status with ID ${id} not found.`);
      }

      return await prisma.paymentStatus.delete({ where: { id } });
    } catch (error) {
      console.error("\n" + error + "\n\n")
    }
  }
}

export { PaymentStatusService }