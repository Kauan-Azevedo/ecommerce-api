import { prisma } from "@/db/prisma.service";
import { Permission } from "@prisma/client";

class PermissionService {
  constructor() {
    // Constructor logic here, if needed
  }

  async createPermission(permission: Permission) {
    return await prisma.permission.create({
      data: permission,
    });
  }

  async getPermissions() {
    console.log("getPermissions");
    return await prisma.permission.findMany();
  }

  async getPermissionById(id: number) {
    return await prisma.permission.findUnique({
      where: {
        id,
      },
    });
  }

  async updatePermission(id: number, permission: Permission) {
    return await prisma.permission.update({
      where: {
        id,
      },
      data: permission,
    });
  }

  async deletePermission(id: number) {
    return await prisma.permission.delete({
      where: {
        id,
      },
    });
  }
}

export { PermissionService };
