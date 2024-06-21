import { prisma } from "@/db/prisma.service";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  constructor() {
    // Constructor logic here, if needed
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials!");
    }

    const secretKey = process.env.SECRET_KEY || "";
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "24h",
    });
    return { user, token };
  }
}

export { AuthService };
