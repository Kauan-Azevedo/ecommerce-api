import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

const prismaErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next?: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P1000":
        return res.status(401).json({ error: { message: "Authentication failed. Please check your database credentials." } });
      case "P1001":
        return res.status(503).json({ error: { message: "Can't reach database server. Please make sure your database server is running." } });
      case "P1002":
        return res.status(504).json({ error: { message: "Database server timeout. Please try again later." } });
      case "P1003":
        return res.status(404).json({ error: { message: "Database not found." } });
      case "P1008":
        return res.status(408).json({ error: { message: "Operation timed out." } });
      case "P1009":
        return res.status(409).json({ error: { message: "Database already exists." } });
      case "P1010":
        return res.status(403).json({ error: { message: "User was denied access to the database." } });
      case "P1011":
        return res.status(500).json({ error: { message: "Error opening a TLS connection." } });
      case "P1012":
        return res.status(400).json({ error: { message: "Invalid schema." } });
      case "P1013":
        return res.status(400).json({ error: { message: "Invalid database string." } });
      case "P1014":
        return res.status(404).json({ error: { message: "Underlying model does not exist." } });
      case "P1015":
        return res.status(400).json({ error: { message: "Unsupported Prisma schema feature for this database version." } });
      case "P1016":
        return res.status(400).json({ error: { message: "Incorrect number of parameters in raw query." } });
      case "P1017":
        return res.status(500).json({ error: { message: "Server has closed the connection." } });

      case "P2000":
        return res.status(400).json({ error: { message: "Value is too long for the column." } });
      case "P2001":
        return res.status(404).json({ error: { message: "Record not found." } });
      case "P2002":
        return res.status(409).json({ error: { message: "Unique constraint failed on the field(s): " + (err.meta?.target ?? "") } });
      case "P2003":
        return res.status(400).json({ error: { message: "Foreign key constraint failed." } });
      case "P2004":
        return res.status(400).json({ error: { message: "A constraint failed on the database." } });
      case "P2005":
        return res.status(400).json({ error: { message: "Invalid value stored in the database." } });
      case "P2006":
        return res.status(400).json({ error: { message: "Invalid value provided for a field." } });
      case "P2007":
        return res.status(400).json({ error: { message: "Data validation error." } });
      case "P2008":
        return res.status(400).json({ error: { message: "Failed to parse the query." } });
      case "P2009":
        return res.status(400).json({ error: { message: "Failed to validate the query." } });
      case "P2010":
        return res.status(500).json({ error: { message: "Raw query failed." } });
      case "P2011":
        return res.status(400).json({ error: { message: "Null constraint violation." } });
      case "P2012":
        return res.status(400).json({ error: { message: "Missing required value." } });
      case "P2013":
        return res.status(400).json({ error: { message: "Missing required argument." } });
      case "P2014":
        return res.status(400).json({ error: { message: "Required relation violation." } });
      case "P2015":
        return res.status(404).json({ error: { message: "Related record not found." } });
      case "P2016":
        return res.status(400).json({ error: { message: "Query interpretation error." } });
      case "P2017":
        return res.status(400).json({ error: { message: "Relation not connected." } });
      case "P2018":
        return res.status(400).json({ error: { message: "Required connected records not found." } });
      case "P2019":
        return res.status(400).json({ error: { message: "Input error." } });
      case "P2020":
        return res.status(400).json({ error: { message: "Value out of range." } });
      case "P2021":
        return res.status(404).json({ error: { message: "Table does not exist in the database." } });
      case "P2022":
        return res.status(404).json({ error: { message: "Column does not exist in the database." } });
      case "P2023":
        return res.status(400).json({ error: { message: "Inconsistent column data." } });
      case "P2024":
        return res.status(503).json({ error: { message: "Timed out fetching a new connection from the connection pool." } });
      case "P2025":
        return res.status(404).json({ error: { message: "An operation failed because it depends on one or more records that were required but not found." } });
      case "P2026":
        return res.status(400).json({ error: { message: "Current database provider doesn't support a feature used in the query." } });
      case "P2027":
        return res.status(500).json({ error: { message: "Multiple errors occurred on the database during query execution." } });
      case "P2028":
        return res.status(400).json({ error: { message: "Transaction API error." } });
      case "P2029":
        return res.status(400).json({ error: { message: "Query parameter limit exceeded." } });
      case "P2030":
        return res.status(400).json({ error: { message: "Cannot find a fulltext index for the search." } });
      case "P2031":
        return res.status(400).json({ error: { message: "Prisma needs MongoDB server to be run as a replica set for transactions." } });
      case "P2033":
        return res.status(400).json({ error: { message: "Number used in the query does not fit into a 64-bit signed integer." } });
      case "P2034":
        return res.status(409).json({ error: { message: "Transaction failed due to a write conflict or a deadlock. Please retry your transaction." } });
      case "P2035":
        return res.status(500).json({ error: { message: "Assertion violation on the database." } });
      case "P2036":
        return res.status(500).json({ error: { message: "Error in external connector." } });
      case "P2037":
        return res.status(503).json({ error: { message: "Too many database connections opened." } });

      case "P3000":
        return res.status(500).json({ error: { message: "Failed to create database." } });
      case "P3001":
        return res.status(400).json({ error: { message: "Migration possible with destructive changes." } });
      case "P3002":
        return res.status(400).json({ error: { message: "Migration was rolled back." } });
      case "P3003":
        return res.status(400).json({ error: { message: "Format of migrations changed, saved migrations are no longer valid." } });
      case "P3004":
        return res.status(400).json({ error: { message: "Cannot alter a system database with prisma migrate." } });
      case "P3005":
        return res.status(400).json({ error: { message: "Database schema is not empty." } });
      case "P3006":
        return res.status(400).json({ error: { message: "Migration failed to apply cleanly to the shadow database." } });
      case "P3007":
        return res.status(400).json({ error: { message: "Preview features are not allowed in schema engine." } });
      case "P3008":
        return res.status(400).json({ error: { message: "Migration is already recorded as applied in the database." } });
      case "P3009":
        return res.status(400).json({ error: { message: "Failed migrations found in the target database, new migrations will not be applied." } });
      case "P3010":
        return res.status(400).json({ error: { message: "Migration name is too long." } });
      case "P3011":
        return res.status(400).json({ error: { message: "Migration cannot be rolled back because it was never applied." } });
      case "P3012":
        return res.status(400).json({ error: { message: "Migration cannot be rolled back because it is not in a failed state." } });
      case "P3013":
        return res.status(400).json({ error: { message: "Datasource provider arrays are no longer supported in migrate." } });
      case "P3014":
        return res.status(400).json({ error: { message: "Could not create the shadow database." } });
      case "P3015":
        return res.status(400).json({ error: { message: "Migration file not found." } });
      case "P3016":
        return res.status(400).json({ error: { message: "Fallback method for database resets failed." } });
      case "P3017":
        return res.status(400).json({ error: { message: "Migration not found." } });
      case "P3018":
        return res.status(400).json({ error: { message: "Migration failed to apply." } });
      case "P3019":
        return res.status(400).json({ error: { message: "Datasource provider mismatch." } });
      case "P3020":
        return res.status(400).json({ error: { message: "Automatic creation of shadow databases is disabled on Azure SQL." } });
      case "P3021":
        return res.status(400).json({ error: { message: "Foreign keys cannot be created on this database." } });
      case "P3022":
        return res.status(400).json({ error: { message: "Direct execution of DDL SQL statements is disabled on this database." } });

      case "P4000":
        return res.status(500).json({ error: { message: "Introspection operation failed." } });
      case "P4001":
        return res.status(404).json({ error: { message: "Introspected database is empty." } });
      case "P4002":
        return res.status(400).json({ error: { message: "Schema of the introspected database was inconsistent." } });

      case "P6000":
        return res.status(500).json({ error: { message: "Generic server error." } });
      case "P6001":
        return res.status(400).json({ error: { message: "Malformed URL." } });
      case "P6002":
        return res.status(401).json({ error: { message: "Invalid API key." } });
      case "P6003":
        return res.status(403).json({ error: { message: "Plan limit reached." } });
      case "P6004":
        return res.status(408).json({ error: { message: "Query timeout." } });
      case "P6005":
        return res.status(400).json({ error: { message: "Invalid parameters." } });
      case "P6006":
        return res.status(400).json({ error: { message: "Prisma version not supported." } });
      case "P6008":
        return res.status(500).json({ error: { message: "Engine failed to start." } });
      case "P6009":
        return res.status(413).json({ error: { message: "Response size limit exceeded." } });
      case "P6010":
        return res.status(403).json({ error: { message: "Project is disabled." } });

      case "P6100":
        return res.status(500).json({ error: { message: "Prisma Pulse server error." } });
      case "P6101":
        return res.status(400).json({ error: { message: "Datasource error in Prisma Pulse." } });
      case "P6102":
        return res.status(401).json({ error: { message: "Unauthorized API key in Prisma Pulse." } });
      case "P6103":
        return res.status(403).json({ error: { message: "Prisma Pulse project is not enabled." } });
      case "P6104":
        return res.status(403).json({ error: { message: "Prisma Data Platform account is blocked." } });
      case "P6105":
        return res.status(400).json({ error: { message: "Incompatible Prisma version for Prisma Pulse." } });
      default:
        return res.status(500).json({ error: { message: "An unexpected error occurred.", code: err.code } });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json("Invalid payload provided.")
  }

  return res.status(500).json({ error: { message: "An unexpected error occurred." } });
};

export default prismaErrorHandler;