'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  variants?: ProductVariant[];
  discount?: number;
  chiltanpureUrl?: string;
  stock?: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedVariant?: ProductVariant) => void;
  removeFromCart: (productId: number, variantId?: string) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyDiscount: (code: string) => boolean;
  discountCode: string | null;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      setCart([]);
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/cart?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to load cart');
      }

      const data = await response.json();
      const cartItems: CartItem[] = data.cartItems.map((item: any) => ({
        id: item.productId,
        name: item.product.name,
        price: parseFloat(item.product.price),
        description: '', // We'll need to add this to the API response
        image: '', // We'll need to add this to the API response
        category: '', // We'll need to add this to the API response
        quantity: item.quantity,
        selectedVariant: item.variant ? {
          id: item.variant.id,
          name: item.variant.name,
          price: parseFloat(item.variant.price),
        } : undefined,
      }));

      setCart(cartItems);
    } catch (error) {
      console.error('Error loading cart from database:', error);
    }
  };

  const addToCart = async (product: Product, selectedVariant?: ProductVariant) => {
    if (!user) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          variantId: selectedVariant?.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Reload cart to get updated state
        await loadCartFromDatabase();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: number, variantId?: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/cart?userId=${user.id}&productId=${productId}&variantId=${variantId || ''}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload cart to get updated state
        await loadCartFromDatabase();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number, variantId?: string) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId, variantId);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
          variantId,
          quantity,
        }),
      });

      if (response.ok) {
        // Reload cart to get updated state
        await loadCartFromDatabase();
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        setCart([]);
        setDiscountCode(null);
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => {
      const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
      return total + itemPrice * item.quantity;
    }, 0);
    return subtotal - discountAmount;
  };

  const applyDiscount = (code: string): boolean => {
    const validCodes: { [key: string]: number } = {
      'WELCOME10': 0.10, // 10% off
      'SAVE20': 0.20,    // 20% off
      'ORGANIC15': 0.15, // 15% off
      'FIRST50': 50,     // Rs 50 off
      'FIRST100': 100,   // Rs 100 off
    };

    const upperCode = code.toUpperCase();
    if (validCodes[upperCode]) {
      setDiscountCode(upperCode);
      const subtotal = cart.reduce((total, item) => {
        const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
        return total + itemPrice * item.quantity;
      }, 0);
      
      const discount = validCodes[upperCode];
      if (discount < 1) {
        // Percentage discount
        setDiscountAmount(subtotal * discount);
      } else {
        // Fixed amount discount
        setDiscountAmount(Math.min(discount, subtotal));
      }
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        applyDiscount,
        discountCode,
        discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
