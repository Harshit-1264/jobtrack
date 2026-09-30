import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Load these from node_modules at runtime instead of bundling them.
  // Prisma recommends it for driver-adapter packages, which open raw sockets and
  // resolve parts of themselves dynamically. Precautionary — this was NOT the cause
  // of the pool-timeout bug (that was MySQL 8.4 auth; see src/lib/prisma.ts).
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
};

export default nextConfig;
