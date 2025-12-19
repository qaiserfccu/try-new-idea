#!/usr/bin/env node
// List users from DB to find a valid user id for testing

const makeClient = () => {
  const PrismaPkg = require('../lib/generated/prisma')
  const PrismaClient = PrismaPkg.PrismaClient || PrismaPkg.Prisma
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  const adapter = new PrismaPg(pool)

  const client = new PrismaClient({ adapter })
  return client
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Please set DATABASE_URL in the environment and re-run')
    process.exit(2)
  }

  const prisma = makeClient()
  try {
    const users = await prisma.user.findMany({ take: 10 })
    console.log('Users:', users.map(u => ({ id: u.id, email: u.email, name: u.name })))
  } catch (err) {
    console.error('Error listing users:', err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}

main()
