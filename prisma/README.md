# Database Setup with Prisma

This project uses Prisma ORM for PostgreSQL database management.

## Prerequisites

- PostgreSQL database (local or cloud)
- Node.js installed
- Database URL configured in environment variables

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database URL

Create a `.env` file in the root directory (or update existing):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/chiltanpure?schema=public"
```

Replace the connection string with your actual PostgreSQL credentials.

### 3. Initialize Database

Run the init.sql script to create tables and seed data:

```bash
npm run db:init
```

Or manually run:
```bash
psql $DATABASE_URL -f prisma/init.sql
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 5. Run Migrations (Optional)

If you make changes to the Prisma schema:

```bash
npm run prisma:migrate
```

## Database Schema

### Tables

1. **roles** - User roles (admin, user, manager)
2. **users** - User accounts with role assignments
3. **products** - Product catalog with ChiltanPure sync data
4. **orders** - Customer orders
5. **order_items** - Order line items

### Test Users

The `init.sql` script creates three test users:

- **Admin**: admin@trynewidea.com / Admin123
- **User**: user@trynewidea.com / User123
- **Manager**: manager@trynewidea.com / Manager123

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run db:init` - Initialize database with init.sql

## Using Prisma in Code

Import and use the Prisma client:

```typescript
import prisma from '@/lib/prisma';

// Example: Get all users
const users = await prisma.user.findMany();

// Example: Create a product
const product = await prisma.product.create({
  data: {
    name: 'Organic Honey',
    price: 1500,
    category: 'Food & Beverages',
    stock: 50
  }
});
```

## Migration Guide

To migrate from the old `pg` Pool approach to Prisma:

1. All database queries should use the Prisma client instead of raw SQL
2. Import `prisma` from `@/lib/prisma` instead of `pool` from `@/lib/db`
3. Use Prisma's type-safe query methods instead of `pool.query()`

Example:

**Before (with pg):**
```typescript
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
const user = result.rows[0];
```

**After (with Prisma):**
```typescript
const user = await prisma.user.findUnique({
  where: { email }
});
```

## Currency

All prices in the database are stored in Pakistani Rupees (PKR Rs.) using DECIMAL(10, 2) for precision.

## Product Sync

Products are synced from ChiltanPure.com with:
- Product name and description
- Images from ChiltanPure CDN
- ChiltanPure URL with referral code
- Price in PKR Rs.
- Stock information

## Notes

- The Prisma Client is generated to `lib/generated/prisma` (gitignored)
- Database migrations are stored in `prisma/migrations`
- Schema changes should be made in `prisma/schema.prisma`
- Always run `prisma generate` after schema changes
