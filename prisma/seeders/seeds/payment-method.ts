import { createPaymentMethod } from "./setup/setup"

let paymentMethodsFromEnv = process.env.SEED_PAYMENT_METHODS?.split(",").map((paymentMethod) => paymentMethod.trim())

export async function seedPaymentMethods() {

    if (!paymentMethodsFromEnv) {
        paymentMethodsFromEnv = ["Credit Card", "Debit Card", "Pix", "PayPal"]
    }

    paymentMethodsFromEnv.forEach(async (paymentMethod) => {
        await createPaymentMethod(paymentMethod)
    })
}