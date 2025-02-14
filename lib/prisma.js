import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient(); // To query database

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/* globalThis.prisma: This global variable ensures that the Prisma client instance 
is reused across hot reloads during development mode. 
Without this each time your application reloads/refresh, a new instance of the prisma client 
would be created, potentially leading to connection issues. */
