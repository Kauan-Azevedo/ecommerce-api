import { prisma } from "@/db/prisma.service";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

class UsersService {
  async createUser(user: User) {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }

  async updateUser(id: number, user: User) {
    return prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}

export { UsersService };
