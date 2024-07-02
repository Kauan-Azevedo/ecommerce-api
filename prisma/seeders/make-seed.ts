import { seedPaymentMethods } from "./seeds/payment-method";
import { seedPaymentStatus } from "./seeds/payment-status";
import { seedPermissions } from "./seeds/permission";
import { seedStatus } from "./seeds/status";
import { seedUsers } from "./seeds/user";

async function main() {
  console.log("\n\nSEEDING DATABASE\n\n")

  await seedPermissions()
  await seedStatus()
  await seedPaymentMethods()
  await seedPaymentStatus()
  await seedUsers()

  console.log("\n\nFINISHED SEEDING \n\n")
}

main()