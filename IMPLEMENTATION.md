# ChiltanPure Referral Integration - Implementation Guide

## 🎯 Project Overview

This project implements a complete ChiltanPure-style eCommerce system with referral tracking, user management, admin panel, and glass-morphism themed UI. All URLs pointing to chiltanpure.com include the referral code `bg_ref=XEUldZfjcO`.

## ✨ Key Features Implemented

### 1. Referral Code Integration
- **Referral Code**: `XEUldZfjcO`
- **Base URL**: `https://chiltanpure.com?bg_ref=XEUldZfjcO`
- All chiltanpure.com links automatically include the referral code
- Centralized management through `app/lib/constants.ts`

### 2. User Module (Complete)
- **Dashboard**: Overview of orders, statistics, and quick actions
- **Profile Management**: Edit name, phone, view account details
- **Address Management**: Add, edit, delete, and set default addresses
- **Order History**: View all orders with filtering by status
- **Order Tracking**: Detailed order timeline with shipping information
- **Wishlist**: Save favorite products for later

### 3. Admin Panel (Structure Complete)
- **Default Credentials**:
  - Email: `admin@trynewidea.com`
  - Password: `Admin123`
- **Dashboard**: View statistics (orders, users, revenue)
- **User Management**: View and manage all registered users
- **Orders**: Placeholder for order management
- **Products**: Placeholder with referral URL display
- **Analytics**: Placeholder for visitor tracking
- **Promotions**: Placeholder for discount code management
- **Contacts**: Placeholder for contact form submissions

### 4. Enhanced Checkout Workflow
- **Auto-Account Creation**: Users only need to provide password during checkout
- **Auto-Login**: Immediately logged in after account creation
- **Order Confirmation**: Redirected to order details page showing tracking info
- **Payment Methods**: Cash on Delivery (COD) and Online Payment
- **Promo Codes**: Support for discount codes (WELCOME10, SAVE20, etc.)

### 5. Theme System
- **Dark Mode**: Default purple gradient theme
- **Light Mode**: Clean, bright alternative
- **Glass-morphism**: Consistent design across all components
- **Theme Toggle**: Persistent theme selection in navbar

### 6. Authentication
- **Role-Based**: Admin and User roles
- **Protected Routes**: Automatic redirection based on role
- **Session Management**: Persistent login with localStorage
- **Password-Only Signup**: Simplified checkout experience

## 📁 Project Structure

```
app/
├── admin/                    # Admin panel pages
│   ├── dashboard/           # Admin dashboard
│   ├── orders/              # Order management
│   ├── products/            # Product management
│   ├── users/               # User management
│   ├── analytics/           # Analytics & monitoring
│   ├── promotions/          # Promotion codes
│   └── contacts/            # Contact submissions
├── user/                     # User module pages
│   ├── dashboard/           # User dashboard
│   ├── profile/             # Profile management
│   ├── orders/              # Order history & tracking
│   ├── addresses/           # Address management
│   └── wishlist/            # Wishlist
├── components/               # Reusable components
│   ├── Navbar.tsx           # Navigation with theme toggle
│   ├── Footer.tsx           # Footer component
│   ├── ThemeToggle.tsx      # Theme switcher
│   ├── UserLayout.tsx       # User page layout
│   ├── AdminLayout.tsx      # Admin page layout
│   └── ProductCatalog.tsx   # Product display
├── context/                  # React contexts
│   ├── AuthContext.tsx      # Authentication state
│   ├── CartContext.tsx      # Shopping cart state
│   └── ThemeContext.tsx     # Theme state
├── lib/                      # Utilities and types
│   ├── constants.ts         # App constants & referral config
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Helper functions
├── cart/                     # Shopping cart page
├── checkout/                 # Checkout page
├── login/                    # Login/Signup page
└── page.tsx                  # Homepage
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Access the Application

#### As a User:
1. Visit `http://localhost:3000`
2. Browse products and add to cart
3. Go to checkout
4. Enter your information and a password
5. Account is auto-created and you're logged in
6. View your order in the Orders page

#### As Admin:
1. Click "Login" in the navbar
2. Use credentials:
   - Email: `admin@trynewidea.com`
   - Password: `Admin123`
3. Access admin panel from navbar
4. View dashboard and manage the site

## 🎨 Theme Customization

The application supports two themes:

### Dark Mode (Default)
- Purple/indigo gradient background
- Glass-morphism effects
- High contrast for readability

### Light Mode
- Light gradient background
- Subtle glass effects
- Clean, modern appearance

Toggle between themes using the sun/moon icon in the navbar.

## 🔗 Referral Code Configuration

The referral code is configured in `app/lib/constants.ts`:

```typescript
export const CHILTANPURE_REFERRAL_CODE = 'XEUldZfjcO';
export const CHILTANPURE_BASE_URL = 'https://chiltanpure.com';
export const CHILTANPURE_REFERRAL_URL = `${CHILTANPURE_BASE_URL}?bg_ref=${CHILTANPURE_REFERRAL_CODE}`;
```

All links to ChiltanPure use `CHILTANPURE_REFERRAL_URL` to ensure the referral code is included.

## 💾 Data Storage

Currently using localStorage for demo purposes:

- **Users**: `chiltanpure_users`
- **Orders**: `chiltanpure_orders`
- **Addresses**: `chiltanpure_addresses`
- **Wishlist**: `chiltanpure_wishlist`
- **Current User**: `chiltanpure_user`
- **Theme**: `chiltanpure_theme`

For production, replace with proper database integration.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Build Tool**: Turbopack

## 📝 Available Routes

### Public Routes
- `/` - Homepage
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - Login/Signup page
- `/quote` - Quote request

### User Routes (Protected)
- `/user/dashboard` - User dashboard
- `/user/profile` - Profile management
- `/user/orders` - Order history
- `/user/addresses` - Address management
- `/user/wishlist` - Wishlist

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/orders` - Order management
- `/admin/products` - Product management
- `/admin/users` - User management
- `/admin/analytics` - Analytics
- `/admin/promotions` - Promotions
- `/admin/contacts` - Contact submissions

## 🎁 Promo Codes

Demo promo codes available at checkout:
- `WELCOME10` - 10% off
- `SAVE20` - 20% off
- `ORGANIC15` - 15% off
- `FIRST50` - Rs. 50 off
- `FIRST100` - Rs. 100 off

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change Admin Credentials**: The default admin password should be changed
2. **Implement Backend**: Replace localStorage with proper database
3. **Add Authentication**: Implement JWT or session-based auth
4. **Validate Input**: Add server-side validation
5. **Secure API Routes**: Protect API endpoints
6. **HTTPS Only**: Use HTTPS in production
7. **Environment Variables**: Store sensitive data in env variables

## 📊 Next Steps for Full Implementation

### High Priority
1. Implement backend API (Node.js/Express or Next.js API routes)
2. Connect to database (PostgreSQL, MongoDB, etc.)
3. Implement real product sync from ChiltanPure
4. Add payment gateway integration
5. Implement analytics tracking (visitor IP, location, etc.)

### Medium Priority
1. Product CRUD operations
2. Order status management
3. Courier integration
4. Email notifications
5. Contact form backend

### Nice to Have
1. Real-time order tracking
2. Push notifications
3. Mobile app version
4. Advanced analytics dashboards
5. Bulk product import

## 🤝 Contributing

When contributing to this project:
1. Maintain the glass-morphism design system
2. Ensure all ChiltanPure URLs include the referral code
3. Follow TypeScript best practices
4. Test in both light and dark modes
5. Update this README for significant changes

## 📄 License

Copyright © 2024 ChiltanPure. All rights reserved.

## 📞 Support

For questions or issues:
- Email: info@chiltanpure.com
- Phone: +92 (300) 123-4567
- Website: [ChiltanPure](https://chiltanpure.com?bg_ref=XEUldZfjcO)
