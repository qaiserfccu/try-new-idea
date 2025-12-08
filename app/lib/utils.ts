import { CHILTANPURE_REFERRAL_URL, CHILTANPURE_REFERRAL_CODE } from './constants';

/**
 * Ensures URL has the referral code
 */
export function addReferralCode(url: string): string {
  if (!url) return CHILTANPURE_REFERRAL_URL;
  
  // If it's already our referral URL, return as is
  if (url.includes(`bg_ref=${CHILTANPURE_REFERRAL_CODE}`)) {
    return url;
  }
  
  // If it's a ChiltanPure URL, add referral code
  if (url.includes('chiltanpure.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('bg_ref', CHILTANPURE_REFERRAL_CODE);
    return urlObj.toString();
  }
  
  return url;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toFixed(2)}`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `CP-${timestamp}-${random}`;
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(original: number, discounted: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    processing: 'bg-indigo-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    pending: 'bg-yellow-500',
    paid: 'bg-green-500',
    failed: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};
