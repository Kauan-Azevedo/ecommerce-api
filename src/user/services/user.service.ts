import { prisma } from "@/db/prisma.service";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaError403 } from "prisma/middleware/errors/Prisma403";
import { PrismaError404 } from "prisma/middleware/errors/Prisma404";

class UsersService {
  async getAdminPermission() {
    return await prisma.permission.findFirst({ where: { name: "Admin" } });
  }

  async createUser(user: User) {
    const { password, id_permission, id, ...userData } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminID = await this.getAdminPermission()

    if (adminID) {
      if (Number(adminID.id) === id_permission) {
        throw new PrismaError403("Can't create an Admin user");
      }
    }


    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        permission: { connect: { id: id_permission } },
      },
    });
  }

  async createAdmin(user: User) {
    const { password, id, ...userData } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminID = await prisma.permission.findFirst({
      where: { name: "Admin" },
    });

    if (!adminID) {
      throw new PrismaError404("Admin permission not found");
    }

    const id_permission = Number(adminID.id)

    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        id_permission: id_permission,
      },
    });
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        createdAt: true,
        updatedAt: true,
        permission: {
          select: {
            name: true,
          },
        }
      }
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        createdAt: true,
        updatedAt: true,
        permission: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async updateUser(id: number, user: User) {
    return await prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: number) {
    return await prisma.user.update(
      { where: { id }, data: { deletedAt: new Date() } },
    );
  }
}

export { UsersService };
