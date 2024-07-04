import { createStatus } from "./setup/setup"

let statusesFromEnv = process.env.SEED_STATUSES?.split(",").map((status) => status.trim())

export async function seedStatus() {

    if (!statusesFromEnv) {
        statusesFromEnv = ["Active", "Inactive"]
    }

    for (const status of statusesFromEnv) {
        await createStatus(status)
    }
}