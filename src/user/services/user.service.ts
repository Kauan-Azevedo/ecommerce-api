import { prisma } from "@/db/prisma.service";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

class UsersService {
  async createUser(user: User) {
    const { password, id_permission, id, ...userData } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        permission: { connect: { id: id_permission } },
      },
    });
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
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
    return await prisma.user.delete({ where: { id } });
  }
}

export { UsersService };
