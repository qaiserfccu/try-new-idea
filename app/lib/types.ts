// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // Home, Work, etc.
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  trackingNumber?: string;
  courierService?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  variants?: ProductVariant[];
  discount?: number;
  stock: number;
  sku?: string;
  tags?: string[];
  featured?: boolean;
  chiltanpureUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sku?: string;
}

// Promotion Types
export interface Promotion {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

// Analytics Types
export interface AnalyticsVisit {
  id: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  page: string;
  referrer?: string;
  timestamp: string;
}

export interface ProductClick {
  id: string;
  productId: number;
  productName: string;
  userId?: string;
  ipAddress: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  popularProducts: {
    productId: number;
    productName: string;
    clickCount: number;
    viewCount: number;
  }[];
  popularPages: {
    page: string;
    viewCount: number;
  }[];
  recentVisitors: {
    ipAddress: string;
    location?: string;
    timestamp: string;
    page: string;
  }[];
}

// Contact Types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: number;
  addedAt: string;
}

// Courier Types
export interface CourierService {
  id: string;
  name: string;
  trackingUrlTemplate: string;
  active: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierService: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  estimatedDelivery?: string;
  actualDelivery?: string;
  updates: ShipmentUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentUpdate {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}
