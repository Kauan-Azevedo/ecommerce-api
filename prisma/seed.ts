import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminPermission = await prisma.permission.create({
    data: {
      name: "Admin",
    },
  });

  const userPermission = await prisma.permission.create({
    data: {
      name: "Default",
    },
  });

  const hashedAdminPassword = await bcrypt.hash("123321", 10);
  await prisma.user.create({
    data: {
      id_permission: adminPermission.id,
      first_name: "Dummy",
      last_name: "Admin",
      email: "dummyAdmin@gmail.com",
      phone_number: "123456789",
      password: hashedAdminPassword,
    },
  });

  await prisma.user.create({
    data: {
      id_permission: userPermission.id,
      first_name: "Dummy",
      last_name: "User",
      email: "dummyUser@gmail.com",
      phone_number: "987654321",
      password: hashedAdminPassword,
    },
  });
}

main()
  .then(() => {
    console.log("Seeds Added!");
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
