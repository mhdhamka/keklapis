// ==========================================
// Database Operations (Prisma + JSON Store)
// ==========================================

import { PrismaClient } from "@prisma/client";

// 1. Prisma Client singleton instance for NextAuth (PostgreSQL)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// 2. Re-export existing JSON-store entity operations for products, brands, etc.
export * from "./products";
export * from "./brands";
export * from "./registry";
export * from "./manufacturers";
export * from "./images";