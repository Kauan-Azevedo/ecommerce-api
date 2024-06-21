import { prisma } from "@/db/prisma.service"
import { Payment_status } from ".prisma/client"
import { Prisma } from '@prisma/client';

class PaymentStatusService {
  async createPaymentStatus(status: Payment_status) {
    try {
      return await prisma.payment_status.create({ data: status })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getPaymentStatusById(id: number) {
    try {
      return await prisma.payment_status.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error)
    }
  }

  async getAllPaymentStatuses() {
    try {
      return await prisma.payment_status.findMany()
    } catch (error) {
      this.handleError(error)
    }
  }

  async updatePaymentStatus(id: number, status: Payment_status) {
    try {
      return await prisma.payment_status.update({ where: { id }, data: status })
    } catch (error) {
      this.handleError(error)
    }
  }

  async deletePaymentStatus(id: number) {
    try {
      return await prisma.payment_status.delete({ where: { id } })
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known errors
      console.error("A known error occurred: ", error.message)
      throw new Error("A database error occurred.")
    } else {
      // Handle unexpected errors
      console.error("An unexpected error occurred: ", error)
      throw new Error("An unexpected error occurred.")
    }
  }
}

export { PaymentStatusService }