import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/generated/prisma/client'

// `globalThis` is the one object that survives a Next.js hot reload.
// TypeScript doesn't know it can hold a `prisma` key, so we describe the shape.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// function createPrismaClient() {
//   // Prisma 7 needs a driver adapter; PrismaMariaDb is the MySQL one.
//   const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
//   return new PrismaClient({ adapter })
// }


function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!)

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    // MySQL 8.4 uses caching_sha2_password: without TLS the client must fetch the
    // server's RSA key to send the password. Without this, auth silently fails and
    // every query dies as a 10s "pool timeout (active=0 idle=0)".
    // Dev only — production uses TLS, which makes this unnecessary.
    allowPublicKeyRetrieval: true,
    connectionLimit: 10,
  })

  return new PrismaClient({ adapter })
}

// Reuse the client already on globalThis, or make the first one.
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Only cache in dev. Production loads this module once, so it never needs it.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
