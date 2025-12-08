'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

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
  category: string;
  variants?: ProductVariant[];
  discount?: number;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const addToCart = (product: Product, selectedVariant?: ProductVariant) => {
    setCart((prevCart) => {
      const itemKey = selectedVariant ? `${product.id}-${selectedVariant.id}` : `${product.id}`;
      const existingItem = prevCart.find((item) => {
        const cartKey = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : `${item.id}`;
        return cartKey === itemKey;
      });
      
      if (existingItem) {
        return prevCart.map((item) => {
          const cartKey = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : `${item.id}`;
          return cartKey === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prevCart, { ...product, quantity: 1, selectedVariant }];
    });
  };

  const removeFromCart = (productId: number, variantId?: string) => {
    setCart((prevCart) => prevCart.filter((item) => {
      if (variantId) {
        return !(item.id === productId && item.selectedVariant?.id === variantId);
      }
      return item.id !== productId;
    }));
  };

  const updateQuantity = (productId: number, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (variantId) {
          return item.id === productId && item.selectedVariant?.id === variantId
            ? { ...item, quantity }
            : item;
        }
        return item.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode(null);
    setDiscountAmount(0);
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
