'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function QuotePage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate quote submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('Quote request submitted successfully! We will contact you shortly.');
    clearCart();
    setIsSubmitting(false);
    router.push('/');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-8xl mb-6">📋</div>
            <h1 className="text-4xl font-bold text-white mb-4">No Items in Cart</h1>
            <p className="text-xl text-purple-200 mb-8">
              Please add items to your cart before requesting a quote.
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
          <h1 className="text-4xl font-bold text-white mb-4">Request a Quote</h1>
          <p className="text-xl text-purple-200">
            Fill out the form below and we&apos;ll get back to you with a customized quote
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-purple-200 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                      placeholder="Your Gym Name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-purple-200 mb-2">
                    Shipping Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-purple-200 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                    placeholder="Any special requirements or questions..."
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 purple-gradient text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
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
              <h2 className="text-2xl font-bold text-white mb-6">Quote Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="border-b border-purple-500/20 pb-3">
                    <div className="flex gap-3 mb-2">
                      <div className="w-12 h-12 purple-gradient-soft rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        <p className="text-purple-300 text-xs">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Qty: {item.quantity}</span>
                      <span className="text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-purple-500/30 pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span className="text-white">Estimated Total</span>
                  <span className="gradient-text">${getTotalPrice().toFixed(2)}</span>
                </div>
                <p className="text-sm text-purple-300 text-center">
                  Final pricing will be confirmed in your quote
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
