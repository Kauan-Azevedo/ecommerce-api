import { createUser } from "./setup/setup"
import bcrypt from "bcrypt"
import { UserData } from "./types/UserData"


function getEnvData(): UserData {
    const userInfo = {
        userEmail: process.env.SEED_USER_EMAIL,
        userPassword: process.env.SEED_USER_PASSWORD,
        userFirstName: process.env.SEED_USER_FIRST_NAME,
        userLastName: process.env.SEED_USER_LAST_NAME,
        userPhone: process.env.SEED_USER_PHONE,
    }

    for (const [key, value] of Object.entries(userInfo)) {
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    }

    return userInfo as UserData
}

export async function seedUsers() {
    const userData = getEnvData()

    userData.userPassword = await bcrypt.hash(userData.userPassword, 10)

    await createUser(userData)
}