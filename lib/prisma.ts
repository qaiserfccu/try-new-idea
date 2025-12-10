import { PrismaClient } from './generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prevent Prisma client initialization during build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                   process.env.NEXT_PHASE === 'phase-production-server' ||
                   !process.env.DATABASE_URL;

let prisma: PrismaClient;

if (!isBuildTime) {
  prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
  }
} else {
  // During build time, create a mock client that throws an error if used
  prisma = new Proxy({} as PrismaClient, {
    get: () => {
      throw new Error('Prisma client accessed during build time');
    }
  });
}

export default prisma;