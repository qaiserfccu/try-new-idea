'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/UserLayout';
import { WishlistItem, Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

export default function UserWishlist() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState<(WishlistItem & { product: Product })[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('chiltanpure_wishlist') || '[]');
    const userWishlist = savedWishlist.filter((item: WishlistItem) => item.userId === user?.id);
    
    // In a real application, fetch actual product details from an API
    // For demo purposes, create mock product data
    const wishlistWithProducts = userWishlist.map((item: WishlistItem) => ({
      ...item,
      product: {
        id: item.productId,
        name: 'Product ' + item.productId,
        slug: 'product-' + item.productId,
        description: 'Organic product description',
        price: 999,
        image: '💚',
        category: 'Wellness',
        stock: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product,
    }));
    
    setWishlist(wishlistWithProducts);
  }, [user]);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    
    const allWishlist = JSON.parse(localStorage.getItem('chiltanpure_wishlist') || '[]');
    const filtered = allWishlist.filter((item: WishlistItem) => item.id !== id);
    localStorage.setItem('chiltanpure_wishlist', JSON.stringify(filtered));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-xl text-purple-200 mb-4">Your wishlist is empty</p>
              <p className="text-purple-300 mb-6">
                Save products you love for later
              </p>
              <a
                href="/#products"
                className="inline-block purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-xl p-6 hover:bg-white/5 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-20 h-20 purple-gradient-soft rounded-lg flex items-center justify-center text-4xl">
                      {item.product.image}
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Remove from wishlist"
                    >
                      ❌
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.product.name}
                  </h3>
                  <p className="text-2xl font-bold gradient-text mb-4">
                    Rs. {item.product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="w-full purple-gradient text-white px-4 py-2 rounded-full hover:opacity-90 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
