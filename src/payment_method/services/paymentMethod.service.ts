import { prisma } from "@/db/prisma.service"
import { PaymentMethod } from ".prisma/client"

export class PaymentMethodService {
    async createPaymentMethod(paymentMethod: PaymentMethod) {
        return await prisma.paymentMethod.create({ data: paymentMethod })
    }

    async getPaymentMethodById(id: number) {
        return await prisma.paymentMethod.findUnique({ where: { id } })
    }

    async getAllPaymentMethods() {
        return await prisma.paymentMethod.findMany()
    }

    async updatePaymentMethod(id: number, paymentMethod: PaymentMethod) {
        return await prisma.paymentMethod.update({ where: { id }, data: paymentMethod })
    }

    async deletePaymentMethod(id: number) {
        return await prisma.paymentMethod.delete({ where: { id } });
    }
}