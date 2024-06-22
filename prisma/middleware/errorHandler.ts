import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

const prismaErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          error: {
            message:
              "Unique constraint failed on the field(s): " +
              (err.meta?.target ?? ""),
          },
        });
      default:
        return res
          .status(500)
          .json({ error: { message: "An unexpected error occurred." } });
    }
  }

  return res
    .status(500)
    .json({ error: { message: "An unexpected error occurred." } });
};

export default prismaErrorHandler;
