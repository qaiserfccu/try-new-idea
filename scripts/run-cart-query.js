#!/usr/bin/env node
// Quick repro script to run the failing Prisma query outside of Next.js
// Usage: DATABASE_URL='postgresql://...' node scripts/run-cart-query.js

const makeClient = () => {
  // Use the generated Prisma client directly so we can control logging options
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PrismaPkg = require('../lib/generated/prisma')
  // The generated package exports `PrismaClient` at top-level
  const PrismaClient = PrismaPkg.PrismaClient || PrismaPkg.Prisma

  // The project uses the @prisma/adapter-pg adapter; construct the adapter here
  // so the PrismaClient constructor is satisfied (engine type "client" requires an adapter)
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  const adapter = new PrismaPg(pool)

  // Enable query logging so we can capture the exact SQL that causes P2022
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
    adapter,
  })

  client.$on('query', (e) => {
    console.log('[prisma:query]', e.query)
    if (e.params) console.log('[prisma:query params]', e.params)
  })
  client.$on('error', (e) => console.error('[prisma:error]', e))
  client.$on('warn', (e) => console.warn('[prisma:warn]', e))

  return client
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Please set DATABASE_URL in the environment and re-run')
    process.exit(2)
  }

  const prisma = makeClient()

  try {
    console.log('Running prisma.cart.findFirst({ where: { userId: 1 } })')
    const r = await prisma.cart.findFirst({ where: { userId: 1 } })
    console.log('Result:', r)
    console.log('Running prisma.cart.findFirst(...) with cartItems/product/variant include')
    const r2 = await prisma.cart.findFirst({
      where: { userId: 1 },
      include: {
        cartItems: {
          include: { product: true, variant: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    console.log('Include result:', JSON.stringify(r2, null, 2))
  } catch (err) {
    console.error('Caught error:')
    console.error(err && err.message ? err.message : err)
    // print out additional properties if present
    console.error('Error object keys:', Object.keys(err || {}))
    if (err && err.meta) console.error('err.meta =', err.meta)
    if (err && err.code) console.error('err.code =', err.code)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}

main()
