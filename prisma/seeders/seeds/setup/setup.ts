import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import { UserData } from "../types/UserData"

dotenv.config()

export function createPermission(name: string) {
    if (!name) {
        console.log("Skip permission creation: Name not informed")
        return
    }

    return prisma.permission.create({
        data: {
            name: name,
        },
    })
}

export function createUser(userData: UserData) {
    if (!userData.userFirstName || !userData.userLastName || !userData.userEmail || !userData.userPhone || !userData.userPassword) {
        console.log("Skip user creation: Missing informations")
        return
    }

    return prisma.user.create({
        data: {
            id_permission: 1,
            first_name: userData.userFirstName,
            last_name: userData.userLastName,
            email: userData.userEmail,
            phone_number: userData.userPhone,
            password: userData.userPassword,
        },
    })
}

export function createStatus(name: string) {
    if (!name) {
        console.log("Skip status creation: Name not informed")
        return
    }

    return prisma.status.create({
        data: {
            name: name,
        },
    })
}

export function createPaymentMethod(name: string) {
    if (!name) {
        console.log("Skip payment method creation: Name not informed")
        return
    }

    return prisma.paymentMethod.create({
        data: {
            name: name,
        },
    })
}

export function createPaymentStatus(name: string) {
    if (!name) {
        console.log("Skip payment status creation: Name not informed")
        return
    }

    return prisma.paymentStatus.create({
        data: {
            name: name,
        },
    })

}

export function createProduct(name: string, description: string, price: number, stock: number, id_status: number) {
    if (!name || !description || !price || !stock || !id_status) {
        console.log("Skip product creation: Missing informations")
        return
    }

    return prisma.product.create({
        data: {
            name: name,
            description: description,
            value: price,
            stock: stock,
        },
    })
}

const prisma = new PrismaClient()