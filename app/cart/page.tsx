'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-purple-200 mb-8">
              Add some amazing organic products to your cart!
            </p>
            <Link
              href="/#products"
              className="inline-block purple-gradient text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
          <p className="text-xl text-purple-200">Review your items before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const itemKey = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : `${item.id}`;
              const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
              
              return (
                <div key={`${itemKey}-${index}`} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 purple-gradient-soft rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
                      {item.image}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                      {item.selectedVariant && (
                        <p className="text-sm text-purple-400 mb-1">Variant: {item.selectedVariant.name}</p>
                      )}
                      <p className="text-sm text-purple-300 mb-2">{item.category}</p>
                      <p className="text-lg font-semibold gradient-text">Rs. {itemPrice.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant?.id)}
                        className="glass w-10 h-10 rounded-full hover:bg-white/20 transition text-white font-bold"
                      >
                        -
                      </button>
                      <span className="text-white font-bold text-lg w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant?.id)}
                        className="glass w-10 h-10 rounded-full hover:bg-white/20 transition text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedVariant?.id)}
                      className="text-red-400 hover:text-red-300 transition flex-shrink-0"
                      title="Remove from cart"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => {
                  const itemKey = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : `${item.id}`;
                  const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
                  
                  return (
                    <div key={`${itemKey}-${index}`} className="flex justify-between text-purple-200">
                      <span>{item.name} {item.selectedVariant && `(${item.selectedVariant.name})`} × {item.quantity}</span>
                      <span className="text-white font-semibold">
                        Rs. {(itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-purple-500/30 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">Rs. {getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full purple-gradient text-white text-center px-6 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/#products"
                className="block w-full glass text-center text-purple-200 hover:bg-white/20 px-6 py-3 rounded-full transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
