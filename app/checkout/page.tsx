'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart, applyDiscount, discountCode, discountAmount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate totals
      const subtotal = cart.reduce((total, item) => {
        const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
        return total + itemPrice * item.quantity;
      }, 0);
      const shippingCost = subtotal > 2000 ? 0 : 150;
      const total = getTotalPrice() + shippingCost;

      // Prepare shipping address
      const shippingAddress = `${formData.address}, ${formData.city}${formData.postalCode ? `, ${formData.postalCode}` : ''}`;

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          cartItems: cart,
          totalAmount: total,
          shippingAddress,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      // Clear cart
      clearCart();

      alert(
        `Order placed successfully!\n\nOrder ID: #${data.orderId}\n\nPayment Method: ${
          paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'
        }\n\nTotal: Rs. ${total.toFixed(2)}\n\nWe will contact you shortly to confirm your order.`
      );

      router.push('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPromo = () => {
    setPromoError('');
    const success = applyDiscount(promoCode);
    if (success) {
      alert('Promo code applied successfully!');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Please try again.');
    }
  };

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

  const subtotal = cart.reduce((total, item) => {
    const itemPrice = item.selectedVariant ? item.selectedVariant.price : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const shippingCost = subtotal > 2000 ? 0 : 150; // Free shipping over Rs. 2000

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Checkout</h1>
          <p className="text-xl text-purple-200">
            {isAuthenticated
              ? `Welcome back, ${user?.name}! Complete your order below.`
              : 'Complete your order as a guest or login for faster checkout.'}
          </p>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="inline-block mt-4 text-purple-400 hover:text-purple-300 transition"
            >
              Login to your account →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-purple-200 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-purple-200 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-purple-200 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                      placeholder="Lahore"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-purple-200 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                      placeholder="54000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-purple-200 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="Any special instructions..."
                  ></textarea>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'cod'
                          ? 'purple-gradient text-white'
                          : 'glass hover:bg-white/20 text-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="font-semibold">Cash on Delivery (COD)</div>
                          <div className="text-sm opacity-80">Pay when you receive your order</div>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('online')}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'online'
                          ? 'purple-gradient text-white'
                          : 'glass hover:bg-white/20 text-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="w-5 h-5"
                        />
                        <div>
                          <div className="font-semibold">Online Payment</div>
                          <div className="text-sm opacity-80">Pay securely with card or bank transfer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 purple-gradient text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                  <Link
                    href="/cart"
                    className="glass text-purple-200 hover:bg-white/20 px-8 py-4 rounded-full transition font-semibold text-center"
                  >
                    Back to Cart
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.selectedVariant?.id || index}`} className="border-b border-purple-500/20 pb-3">
                    <div className="flex gap-3 mb-2">
                      <div className="w-12 h-12 purple-gradient-soft rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        {item.selectedVariant && (
                          <p className="text-purple-300 text-xs">{item.selectedVariant.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Qty: {item.quantity}</span>
                      <span className="text-white font-semibold">
                        Rs. {((item.selectedVariant?.price || item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300 text-sm"
                    placeholder="Enter code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="purple-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-400 text-xs mt-1">{promoError}</p>
                )}
                {discountCode && (
                  <p className="text-green-400 text-xs mt-1">
                    ✓ Promo code &quot;{discountCode}&quot; applied
                  </p>
                )}
                <p className="text-purple-300 text-xs mt-2">
                  Try: WELCOME10, SAVE20, ORGANIC15
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-purple-200">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">Rs. {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span className="font-semibold">- Rs. {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-purple-200">
                  <span>Shipping</span>
                  <span className="text-white font-semibold">
                    {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-purple-300">
                    Add Rs. {(2000 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-purple-500/30 pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">Rs. {(getTotalPrice() + shippingCost).toFixed(2)}</span>
                </div>
                <p className="text-sm text-purple-300 text-center">
                  {paymentMethod === 'cod'
                    ? '💵 Cash on Delivery Available'
                    : '🔒 Secure Online Payment'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
