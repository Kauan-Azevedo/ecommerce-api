import { prisma } from "@/db/prisma.service"
import { PaymentMethod } from ".prisma/client"

export class PaymentMethodService {
    async createPaymentMethod(paymentMethod: PaymentMethod) {
        try {
            const record = await prisma.paymentMethod.findFirst({ where: { name: paymentMethod.name } })

            if (record) {
                throw new Error(`Payment method with name ${paymentMethod.name} already exists.`);
            }

            return await prisma.paymentMethod.create({ data: paymentMethod })
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async getPaymentMethodById(id: number) {
        try {
            return await prisma.paymentMethod.findUnique({ where: { id } })
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async getAllPaymentMethods() {
        try {
            return await prisma.paymentMethod.findMany()
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async updatePaymentMethod(id: number, paymentMethod: PaymentMethod) {
        try {
            const record = await prisma.paymentMethod.update({ where: { id }, data: paymentMethod })

            if (!record) {
                throw new Error(`Payment method with ID ${id} not found on update.`);
            }

            return record
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }

    async deletePaymentMethod(id: number) {
        try {
            const record = await prisma.paymentMethod.findUnique({ where: { id } });

            if (!record) {
                throw new Error(`Payment method with ID ${id} not found.`);
            }

            return await prisma.paymentMethod.delete({ where: { id } });
        } catch (error) {
            console.error("\n\n" + error + "\n\n")
        }
    }
}