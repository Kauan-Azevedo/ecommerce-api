import { createStatus } from "./setup/setup"

let statusesFromEnv = process.env.SEED_STATUSES?.split(",").map((status) => status.trim())

export async function seedStatus() {

    if (!statusesFromEnv) {
        statusesFromEnv = ["Active", "Inactive"]
    }

    statusesFromEnv.forEach(async (status) => {
        await createStatus(status)
    })
}