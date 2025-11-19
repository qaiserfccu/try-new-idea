'use client';

import { useState } from 'react';
import { useCart, Product } from '../context/CartContext';

// Currency conversion rate: 1 USD = 3.75 SAR
const USD_TO_SAR = 3.75;

const products: Product[] = [
  {
    id: 1,
    name: 'Professional Gymnastics Mat',
    price: 299.99 * USD_TO_SAR,
    description: 'High-density foam mat with non-slip surface, perfect for training and competitions.',
    image: '🤸‍♀️',
    category: 'Mats',
  },
  {
    id: 2,
    name: 'Competition Balance Beam',
    price: 1299.99 * USD_TO_SAR,
    description: 'Olympic-standard balance beam with adjustable height and premium suede covering.',
    image: '⚖️',
    category: 'Beams',
  },
  {
    id: 3,
    name: 'Adjustable Uneven Bars',
    price: 2499.99 * USD_TO_SAR,
    description: 'Professional-grade uneven bars with fiberglass construction and adjustable settings.',
    image: '🏋️',
    category: 'Bars',
  },
  {
    id: 4,
    name: 'Training Vault Table',
    price: 1899.99 * USD_TO_SAR,
    description: 'Height-adjustable vault table with premium cushioning for safe landings.',
    image: '🎯',
    category: 'Vaults',
  },
  {
    id: 5,
    name: 'Folding Gymnastics Mat',
    price: 149.99 * USD_TO_SAR,
    description: 'Portable folding mat ideal for home practice and easy storage.',
    image: '📦',
    category: 'Mats',
  },
  {
    id: 6,
    name: 'Parallel Bars Set',
    price: 1799.99 * USD_TO_SAR,
    description: 'Sturdy parallel bars for strength training and advanced gymnastics routines.',
    image: '💪',
    category: 'Bars',
  },
  {
    id: 7,
    name: 'Pommel Horse',
    price: 2299.99 * USD_TO_SAR,
    description: 'Professional pommel horse with adjustable height and durable construction.',
    image: '🐴',
    category: 'Apparatus',
  },
  {
    id: 8,
    name: 'Still Rings Set',
    price: 899.99 * USD_TO_SAR,
    description: 'Competition-grade still rings with adjustable height and secure mounting system.',
    image: '⭕',
    category: 'Rings',
  },
  {
    id: 9,
    name: 'Spring Floor System',
    price: 4999.99 * USD_TO_SAR,
    description: 'Professional spring floor system for tumbling and floor exercise routines.',
    image: '🌊',
    category: 'Floors',
  },
  {
    id: 10,
    name: 'Junior Training Beam',
    price: 299.99 * USD_TO_SAR,
    description: 'Low height balance beam perfect for beginners and young gymnasts.',
    image: '📏',
    category: 'Beams',
  },
  {
    id: 11,
    name: 'Tumbling Track',
    price: 3499.99 * USD_TO_SAR,
    description: 'Long tumbling track with superior bounce for dynamic acrobatic moves.',
    image: '🏃',
    category: 'Floors',
  },
  {
    id: 12,
    name: 'Crash Mat XL',
    price: 599.99 * USD_TO_SAR,
    description: 'Extra-large crash mat for safe landings during training and skill progression.',
    image: '🛡️',
    category: 'Mats',
  },
  {
    id: 13,
    name: 'Wall Bars System',
    price: 799.99 * USD_TO_SAR,
    description: 'Versatile wall-mounted bars for flexibility training and conditioning.',
    image: '🧗',
    category: 'Apparatus',
  },
  {
    id: 14,
    name: 'Rhythmic Gymnastics Hoop',
    price: 49.99 * USD_TO_SAR,
    description: 'Professional rhythmic gymnastics hoop with balanced weight distribution.',
    image: '⭕',
    category: 'Rhythmic',
  },
];

export default function ProductCatalog() {
  const { addToCart, getTotalItems, getTotalPrice } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Products</h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Discover our premium range of gymnastics equipment designed for athletes of all levels
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
              <div className="h-48 purple-gradient-soft flex items-center justify-center text-8xl">
                {product.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <span className="text-sm text-purple-400 font-semibold">{product.category}</span>
                </div>
                <p className="text-purple-200 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">ر.س {product.price.toFixed(2)}</span>
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
              <span className="font-bold">{getTotalItems()}</span> item(s) in cart - Total: ر.س{' '}
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
