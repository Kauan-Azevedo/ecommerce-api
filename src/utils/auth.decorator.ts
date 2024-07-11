import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "";
// PROIBIDO ACESSO DE MENINS

export const authenticateJWT = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

export function Authenticated(allowedPermissions: string[]) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<void> {
      const req = args[0] as Request;
      const res = args[1] as Response;
      const next = args[2] as NextFunction;

      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
        res.status(403).json({ error: "Not authenticated" });
        return;
      }

      try {
        const user = jwt.verify(token as string, SECRET_KEY) as any;
        (req as any).user = user;

        const userPermission: string = user.permission;

        if (
          allowedPermissions.length > 0 &&
          !allowedPermissions.includes(userPermission)
        ) {
          res.status(403).json({ error: "Permission denied" });
          return;
        }

        if (typeof originalMethod === "function") {
          return originalMethod.apply(this, args);
        } else {
          throw new Error("originalMethod is not a function");
        }
      } catch (err) {
        res.sendStatus(403);
        return;
      }
    };

    return descriptor;
  };
}
