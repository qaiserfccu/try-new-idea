'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart, Product, ProductVariant } from '../context/CartContext';

export default function ProductCatalog() {
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: number]: ProductVariant | undefined }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    const selectedVariant = selectedVariants[product.id];
    addToCart(product, selectedVariant);
    alert(`${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} added to cart!`);
  };

  const handleVariantSelect = (productId: number, variant: ProductVariant) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variant,
    }));
  };

  if (loading) {
    return (
      <section id="products" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-white">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Products</h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Discover our premium range of organic and natural products for health, beauty, and wellness
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition ${
                selectedCategory === category
                  ? 'purple-gradient text-white'
                  : 'glass text-purple-200 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform shader-effect"
            >
              <div className="h-48 purple-gradient-soft flex items-center justify-center text-8xl relative">
                {product.image}
                {product.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="text-sm text-purple-400 font-semibold">{product.category}</span>
                </div>
                <p className="text-purple-200 mb-4 text-sm">{product.description}</p>
                
                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-purple-300 mb-2 block">Select Variant:</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantSelect(product.id, variant)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            selectedVariants[product.id]?.id === variant.id
                              ? 'purple-gradient text-white'
                              : 'glass text-purple-200 hover:bg-white/20'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold gradient-text">
                        Rs. {selectedVariants[product.id]?.price || product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-purple-400 line-through ml-2">
                          Rs. {selectedVariants[product.id]?.originalPrice || product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 purple-gradient text-white px-4 py-2 rounded-full hover:opacity-90 transition font-semibold text-sm"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 glass text-white px-4 py-2 rounded-full hover:bg-white/20 transition font-semibold text-sm text-center"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="mt-12 glass-card rounded-2xl p-6 text-center">
            <p className="text-lg text-white">
              <span className="font-bold">{getTotalItems()}</span> item(s) in cart - Total: Rs.{' '}
              <span className="font-bold gradient-text">
                {getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
