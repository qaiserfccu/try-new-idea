# ChiltanPure - Organic & Natural Products E-Commerce Store

A beautiful, modern online shopping store for ChiltanPure, Pakistan's leading organic and natural products brand.

## About ChiltanPure

ChiltanPure is Pakistan's premier e-commerce destination for organic skincare, haircare, essential oils, and wellness products. With over 1,500 ISO-certified organic products, we're committed to providing the highest quality natural products. Learn more at [chiltanpure.com](https://chiltanpure.com).

## Features

- 🌿 100% Organic & ISO-Certified Products
- 🔄 **Automated Product Scraping** - Syncs with ChiltanPure every 2 hours
- 🛍️ Interactive product catalog with category filtering
- 🎨 Product variants support (sizes, colors, types)
- 💳 Multiple checkout options:
  - Cash on Delivery (COD)
  - Online Payment
- 🔐 User Authentication
  - Login/Signup functionality
  - Guest checkout option
- 🎁 Discount & Promo Code System
  - Apply promotional codes at checkout
  - Automatic discount calculation
- 🛒 Advanced Shopping Cart
  - Real-time cart updates
  - Variant selection
  - Quantity management
- 🗄️ **PostgreSQL Database** with Prisma ORM
- 📊 **Admin Panel** with catalog sync management
- 📱 Mobile-friendly responsive design
- ⚡ Built with Next.js 16 and React 19
- 🎯 TypeScript for type safety
- 🎨 Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Install the dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chiltanpure"
```

3. Initialize the database:

```bash
# Run database initialization script
npm run db:init

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) with your browser to see the result.

### Product Scraping

The application includes an automated scraping daemon that syncs products from ChiltanPure every 2 hours.

**Start the scraping daemon:**

```bash
npm run scrape
```

**Trigger a manual scrape:**

```bash
npm run scrape:once
```

For more details on scraping functionality, see [scripts/SCRAPING_README.md](scripts/SCRAPING_README.md).

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Node.js** - Runtime environment

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── cart/              # Shopping cart API
│   │   ├── orders/            # Order management API
│   │   ├── products/          # Product listing API
│   │   ├── profile/           # User profile API
│   │   └── scrape/            # Product scraping API
│   ├── admin/
│   │   ├── catalog-sync/      # ChiltanPure product sync
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── orders/            # Order management
│   │   ├── products/          # Product management
│   │   └── users/             # User management
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation component with auth
│   │   ├── Footer.tsx         # Footer component
│   │   ├── AdminLayout.tsx    # Admin page layout
│   │   └── ProductCatalog.tsx # Product listing with variants
│   ├── context/
│   │   ├── CartContext.tsx    # Shopping cart state management
│   │   └── AuthContext.tsx    # Authentication state management
│   ├── cart/
│   │   └── page.tsx           # Shopping cart page
│   ├── checkout/
│   │   └── page.tsx           # Checkout page with COD option
│   ├── login/
│   │   └── page.tsx           # Login/Signup page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── init.sql               # Initial database setup
│   └── migrations/            # Database migrations
├── scripts/
│   ├── scrape-daemon.js       # Automated scraping daemon
│   ├── SCRAPING_README.md     # Scraping documentation
│   └── db-init.js             # Database initialization
├── lib/
│   ├── db.ts                  # Database connection
│   └── prisma.ts              # Prisma client
├── public/                    # Static assets
└── package.json              # Dependencies
```

## Product Categories

- **Skincare** - Face serums, creams, lotions, treatments
- **Haircare** - Shampoos, oils, henna, treatments
- **Essential Oils** - Pure essential oils for wellness
- **Oral Care** - Natural teeth whitening and oral hygiene
- **Food & Wellness** - Organic foods, seeds, honey, supplements

## Promo Codes

Try these promo codes at checkout:
- `WELCOME10` - 10% off your order
- `SAVE20` - 20% off your order
- `ORGANIC15` - 15% off your order
- `FIRST50` - Rs. 50 off
- `FIRST100` - Rs. 100 off

## Features in Detail

### Authentication
- User registration and login
- Guest checkout option
- Persistent sessions with localStorage
- Profile information management

### Shopping Cart
- Add products with variant selection
- Real-time price calculations
- Quantity adjustments
- Discount application

### Checkout Process
1. Review cart items
2. Enter shipping information
3. Select payment method (COD or Online)
4. Apply promo codes for discounts
5. Place order with confirmation

### Cash on Delivery (COD)
- Available nationwide in Pakistan
- No upfront payment required
- Pay when you receive your order
- Secure and convenient

### Admin Panel
- **Dashboard**: Overview of orders, users, and revenue
- **Catalog Sync**: Sync products from ChiltanPure.com
- **Product Management**: View and manage products
- **Order Management**: Track and update orders
- **User Management**: Manage user accounts

**Admin Credentials:**
- Email: `admin@trynewidea.com`
- Password: `Admin123`

Access the admin panel at `/admin/dashboard` after logging in.

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `roles` - User roles (admin, user, manager)
- `products` - Product catalog from ChiltanPure
- `product_variants` - Product variants (sizes, types)
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items

All database operations use Prisma ORM for type-safe queries.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

Copyright © 2024 ChiltanPure. All rights reserved.
