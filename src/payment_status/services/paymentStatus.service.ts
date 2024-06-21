import { prisma } from "@/db/prisma.service"
import { Payment_status } from ".prisma/client"
import { Prisma } from '@prisma/client';

class PaymentStatusService {
  async createPaymentStatus(status: Payment_status) {
    try {
      const record = await prisma.payment_status.findFirst({ where: { name: status.name } })

      if (record) {
        throw new Error(`Payment status with name ${status.name} already exists.`);
      }

      return await prisma.payment_status.create({ data: status })

    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async getPaymentStatusById(id: number) {
    try {
      return await prisma.payment_status.findUnique({ where: { id } })
    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async getAllPaymentStatuses() {
    try {
      return await prisma.payment_status.findMany()
    } catch (error) {
      console.error("\n\n" + error + "\n\n")
    }
  }

  async updatePaymentStatus(id: number, status: Payment_status) {
    try {
      const record = await prisma.payment_status.update({ where: { id }, data: status })

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
      const record = await prisma.payment_status.findUnique({ where: { id } });

      if (!record) {
        throw new Error(`Payment status with ID ${id} not found.`);
      }

      return await prisma.payment_status.delete({ where: { id } });
    } catch (error) {
      console.error("\n" + error + "\n\n")
    }
  }
}

export { PaymentStatusService }