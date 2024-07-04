import { createPaymentMethod } from "./setup/setup"

let paymentMethodsFromEnv = process.env.SEED_PAYMENT_METHODS?.split(",").map((paymentMethod) => paymentMethod.trim())

export async function seedPaymentMethods() {

    if (!paymentMethodsFromEnv) {
        paymentMethodsFromEnv = ["Credit Card", "Debit Card", "Pix", "PayPal"]
    }

    for (const paymentMethod of paymentMethodsFromEnv) {
        await createPaymentMethod(paymentMethod)
    }
}