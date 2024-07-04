import { createPermission } from "./setup/setup"

let permissionsFromEnv = process.env.SEED_PERMISSIONS?.split(",").map((permission) => permission.trim())

export async function seedPermissions() {

    if (!permissionsFromEnv) {
        permissionsFromEnv = ["Admin", "Seller", "User"]
    }

    // Ensure that Admin permission is always created first
    if (permissionsFromEnv[0] != "Admin") {
        permissionsFromEnv.unshift("Admin")
    }

    for (const permission of permissionsFromEnv) {
        await createPermission(permission)
    }
}