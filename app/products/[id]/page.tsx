'use client';

import { useEffect, useState, useCallback } from 'react';
import { CHILTANPURE_REFERRAL_CODE } from '../../lib/constants';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  chiltanpureUrl?: string;
  images: string[];
  category: string;
  stock: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [productId, setProductId] = useState<string | null>(null);

  const handleRedirect = useCallback(() => {
    if (product?.chiltanpureUrl) {
      // Ensure the URL has the referral parameter
      const url = new URL(product.chiltanpureUrl);
      url.searchParams.set('bg_ref', CHILTANPURE_REFERRAL_CODE);
      window.location.href = url.toString();
    } else {
      // Fallback to main ChiltanPure site
      window.location.href = `https://chiltanpure.com?bg_ref=${CHILTANPURE_REFERRAL_CODE}`;
    }
  }, [product]);

  useEffect(() => {
    params.then((p) => setProductId(p.id));
  }, [params]);

  useEffect(() => {
    if (!productId) return;
    
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        // If product not found, still try to redirect
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, handleRedirect]);

  const handleRedirectNow = () => {
    handleRedirect();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-white text-xl mb-4">Loading product details...</div>
            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 text-center shader-effect">
            {/* Product Info */}
            {product && (
              <div className="mb-8">
                <div className="text-6xl mb-6">🌿</div>
                <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                <p className="text-xl text-green-200 mb-6">{product.description}</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-3xl font-bold gradient-text">
                    Rs. {product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xl text-green-400 line-through">
                      Rs. {product.originalPrice}
                    </div>
                  )}
                </div>
                
                <div className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-full mb-8">
                  {product.category}
                </div>
              </div>
            )}

            {/* Redirect Message */}
            <div className="space-y-6">
              <div className="text-white text-2xl font-semibold mb-4">
                Redirecting to ChiltanPure.com...
              </div>
              
              <div className="text-green-200 text-lg mb-6">
                You&apos;re being redirected to view the full product details on ChiltanPure.com
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold animate-pulse">
                  {countdown}
                </div>
              </div>

              <button
                onClick={handleRedirectNow}
                className="purple-gradient text-white px-10 py-4 rounded-full hover:opacity-90 transition text-lg font-semibold shadow-2xl hover:scale-105 transform"
              >
                Go to ChiltanPure Now →
              </button>

              <p className="text-green-300 text-sm mt-6">
                All purchases support our platform through our referral partnership with ChiltanPure
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✓</div>
              <h3 className="text-white font-semibold mb-2">100% Authentic</h3>
              <p className="text-green-200 text-sm">Genuine ChiltanPure products</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
              <p className="text-green-200 text-sm">Nationwide shipping available</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-white font-semibold mb-2">ISO Certified</h3>
              <p className="text-green-200 text-sm">Certified organic products</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
