import { createPaymentStatus } from "./setup/setup"

let paymentStatusFromEnv = process.env.SEED_PAYMENT_STATUS?.split(",").map((paymentStatus) => paymentStatus.trim())

export async function seedPaymentStatus() {

    if (!paymentStatusFromEnv) {
        paymentStatusFromEnv = ["Paid", "Refunded", "Cancelled", "Failed", "Waiting Payment"]
    }

    for (const paymentStatus of paymentStatusFromEnv) {
        await createPaymentStatus(paymentStatus)
    }
}