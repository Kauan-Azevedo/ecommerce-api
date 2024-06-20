import { prisma } from "@/db/db.config";
import { User } from "@prisma/client";

class UsersService {
  async createUser(user: User) {
    return prisma.user.create({ data: user });
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
