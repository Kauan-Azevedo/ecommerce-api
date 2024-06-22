import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') })

// Function to construct DATABASE_URL from environment variables
const constructDatabaseUrl = (): string => {
    const { DB_USERNAME, DB_PASSWORD, DB_HOST_DOCKER, DB_PORT, DB_NAME, DB_SCHEMA } = process.env
    return `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST_DOCKER}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}`
}

// Function to export DATABASE_URL to .env file
const exportToEnv = (databaseUrl: string) => {
    const envPath = path.join(__dirname, '../../.env')
    let envContent = ''

    // Check if .env file exists and read its content
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, { encoding: 'utf-8' })
    }

    // Check if DATABASE_URL already exists
    const databaseUrlRegex = /^DATABASE_URL=.*/m
    if (databaseUrlRegex.test(envContent)) {
        // Replace existing DATABASE_URL
        envContent = envContent.replace(databaseUrlRegex, `DATABASE_URL=${databaseUrl}`)
    } else {
        // Append DATABASE_URL if it doesn't exist
        envContent += `\nDATABASE_URL=${databaseUrl}\n`
    }

    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent, { encoding: 'utf-8' })
}

const makeDatabaseUrl = () => {
    const databaseUrl = constructDatabaseUrl()
    exportToEnv(databaseUrl)
}

export default makeDatabaseUrl