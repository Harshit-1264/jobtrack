import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/generated/prisma/client'

// `globalThis` is the one object that survives a Next.js hot reload.
// TypeScript doesn't know it can hold a `prisma` key, so we describe the shape.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  // Prisma 7 needs a driver adapter; PrismaMariaDb is the MySQL one.
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  return new PrismaClient({ adapter })
}

// Reuse the client already on globalThis, or make the first one.
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Only cache in dev. Production loads this module once, so it never needs it.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
