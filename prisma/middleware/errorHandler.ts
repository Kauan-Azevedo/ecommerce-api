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
      case "P2000":
        return res.status(400).json({
          error: {
            message: "Invalid 'where' or 'orderBy' value(s) provided.",
          },
        });
      case "P2001":
        return res.status(400).json({
          error: {
            message: "Invalid 'data' value(s) provided.",
          },
        });
      case "P2002":
        return res.status(409).json({
          error: {
            message:
              "Unique constraint failed on the field(s): " +
              (err.meta?.target ?? ""),
          },
        });
      case "P2003":
        return res.status(404).json({
          error: {
            message: "Record not found for the given query.",
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
