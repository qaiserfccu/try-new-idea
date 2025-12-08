'use client';

import { useState } from 'react';
import { useCart, Product, ProductVariant } from '../context/CartContext';

const products: Product[] = [
  {
    id: 1,
    name: 'Vitamin C Serum',
    price: 1099,
    originalPrice: 1560,
    description: 'Reduces wrinkles, fine lines, and dark circles. Promotes shiny and healthier skin with powerful antioxidants.',
    image: '✨',
    category: 'Skincare',
    discount: 30,
  },
  {
    id: 2,
    name: 'Red Onion Oil',
    price: 1099,
    originalPrice: 1560,
    description: 'Reduces hair fall and accelerates hair regrowth. Strengthens hair and improves scalp health naturally.',
    image: '🧴',
    category: 'Haircare',
    discount: 30,
  },
  {
    id: 3,
    name: 'Red Onion Shampoo',
    price: 890,
    originalPrice: 1600,
    description: 'Natural solution for hair regrowth and prevention of hair loss. 100% results guaranteed for all hair types.',
    image: '🧼',
    category: 'Haircare',
    discount: 44,
  },
  {
    id: 4,
    name: 'Hand & Foot Glowing Cream',
    price: 899,
    originalPrice: 1276,
    description: 'Formulated with multivitamins and glowing agents. Moisturizes, soothes, and improves skin texture.',
    image: '🤲',
    category: 'Skincare',
    discount: 30,
  },
  {
    id: 5,
    name: 'Henna Hair & Beard Dye',
    price: 799,
    originalPrice: 1134,
    description: 'Prevents premature greying, improves scalp health, balances pH & oil production.',
    image: '🌿',
    category: 'Haircare',
    discount: 30,
    variants: [
      { id: 'chocolate', name: 'Chocolate', price: 799, originalPrice: 1134 },
      { id: 'coffee', name: 'Coffee', price: 799, originalPrice: 1134 },
      { id: 'amla', name: 'Amla Blend', price: 849, originalPrice: 1200 },
    ],
  },
  {
    id: 6,
    name: 'Activated Charcoal Teeth Whitening',
    price: 999,
    originalPrice: 1418,
    description: 'Whitens teeth naturally, kills cavity-causing bacteria, and eliminates bad breath effectively.',
    image: '🦷',
    category: 'Oral Care',
    discount: 30,
  },
  {
    id: 7,
    name: 'Glow Facial Kit',
    price: 4599,
    originalPrice: 5090,
    description: 'Deep cleansing, anti-aging benefits, enhances skin natural glow. Professional facial at home.',
    image: '💆',
    category: 'Skincare',
    discount: 10,
  },
  {
    id: 8,
    name: 'Mix Seeds (Health Booster)',
    price: 1099,
    originalPrice: 1560,
    description: 'Rich in antioxidants, metabolism booster, excellent source of Omega-3. Perfect for healthy lifestyle.',
    image: '🌰',
    category: 'Food & Wellness',
    discount: 30,
    variants: [
      { id: '250g', name: '250g Pack', price: 1099, originalPrice: 1560 },
      { id: '500g', name: '500g Pack', price: 2099, originalPrice: 2980 },
    ],
  },
  {
    id: 9,
    name: 'Rosemary Essential Oil',
    price: 1072,
    originalPrice: 1522,
    description: 'Antiseptic skin tonic, deeply hydrates, controls sebum production, reduces blemishes.',
    image: '🌱',
    category: 'Essential Oils',
    discount: 30,
  },
  {
    id: 10,
    name: 'Desi Cow Ghee',
    price: 3999,
    originalPrice: 5000,
    description: '#1 cow ghee in Pakistan. Strengthens body, mind, bones, supports heart health. Pure and natural.',
    image: '🥛',
    category: 'Food & Wellness',
    discount: 20,
    variants: [
      { id: '410g', name: '410g', price: 3999, originalPrice: 5000 },
      { id: '820g', name: '820g', price: 7599, originalPrice: 9500 },
    ],
  },
  {
    id: 11,
    name: 'Chia Seeds',
    price: 899,
    originalPrice: 1276,
    description: 'Organic chia seeds rich in fiber, protein, and omega-3. Perfect for smoothies and healthy eating.',
    image: '🌾',
    category: 'Food & Wellness',
    discount: 30,
  },
  {
    id: 12,
    name: 'Multi Grain Atta (14 Grains)',
    price: 1299,
    originalPrice: 1699,
    description: 'Blend of 14 natural ingredients. Healthy flour alternative for nutritious rotis and breads.',
    image: '🌾',
    category: 'Food & Wellness',
    discount: 24,
  },
  {
    id: 13,
    name: 'Sea Buckthorn Powder',
    price: 1599,
    originalPrice: 2099,
    description: 'Superfood rich in vitamins, minerals, and antioxidants. Boosts immunity and overall health.',
    image: '🍊',
    category: 'Food & Wellness',
    discount: 24,
  },
  {
    id: 14,
    name: 'Niacinamide Serum',
    price: 1199,
    originalPrice: 1699,
    description: 'Minimizes pores, evens skin tone, reduces fine lines. Perfect for acne-prone and aging skin.',
    image: '💧',
    category: 'Skincare',
    discount: 29,
  },
  {
    id: 15,
    name: 'Biotin Shampoo',
    price: 990,
    originalPrice: 1400,
    description: 'Strengthens hair, promotes growth, reduces breakage. Enriched with biotin for healthy hair.',
    image: '🧴',
    category: 'Haircare',
    discount: 29,
  },
  {
    id: 16,
    name: 'Tea Tree Essential Oil',
    price: 999,
    originalPrice: 1418,
    description: 'Natural antiseptic, treats acne, fungal infections. Multipurpose essential oil for skin and hair.',
    image: '🌿',
    category: 'Essential Oils',
    discount: 30,
  },
  {
    id: 17,
    name: 'Moringa Powder',
    price: 1399,
    originalPrice: 1899,
    description: 'Organic superfood packed with nutrients. Boosts energy, immunity, and overall wellness.',
    image: '🍃',
    category: 'Food & Wellness',
    discount: 26,
  },
  {
    id: 18,
    name: 'Acacia Honey (Pure & Natural)',
    price: 1899,
    originalPrice: 2499,
    description: 'Pure acacia honey with natural sweetness. Rich in antioxidants and health benefits.',
    image: '🍯',
    category: 'Food & Wellness',
    discount: 24,
    variants: [
      { id: '250g', name: '250g', price: 1899, originalPrice: 2499 },
      { id: '500g', name: '500g', price: 3599, originalPrice: 4799 },
    ],
  },
];

export default function ProductCatalog() {
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: number]: ProductVariant | undefined }>({});

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
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition"
                  >
                    Add to Cart
                  </button>
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
