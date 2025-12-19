import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaAdapter: PrismaPg | undefined;
  // eslint-disable-next-line no-var
  var prismaPool: Pool | undefined;
}

// Prevent Prisma client initialization during build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                   process.env.NEXT_PHASE === 'phase-production-server' ||
                   !process.env.DATABASE_URL;

let prisma: PrismaClient;

if (!isBuildTime) {
  const pool = global.prismaPool || new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const adapter = global.prismaAdapter || new PrismaPg(pool);

  prisma = global.prisma || new PrismaClient({
    adapter,
    // Enable query logging for easier debugging in non-production runs
    // Set PRISMA_LOG env var to control verbosity if needed
    // Cast to any since env-derived strings may not match the strict LogLevel type at compile time
    log: process.env.PRISMA_LOG ? (process.env.PRISMA_LOG.split(',') as any) : (process.env.NODE_ENV === 'production' ? (['error'] as any) : (['query', 'error', 'warn'] as any)),
  });

  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
    global.prismaAdapter = adapter;
    global.prismaPool = pool;
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