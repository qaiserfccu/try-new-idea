'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Professional Gymnastics Mat',
    price: 299.99,
    description: 'High-density foam mat with non-slip surface, perfect for training and competitions.',
    image: '🤸‍♀️',
    category: 'Mats',
  },
  {
    id: 2,
    name: 'Competition Balance Beam',
    price: 1299.99,
    description: 'Olympic-standard balance beam with adjustable height and premium suede covering.',
    image: '⚖️',
    category: 'Beams',
  },
  {
    id: 3,
    name: 'Adjustable Uneven Bars',
    price: 2499.99,
    description: 'Professional-grade uneven bars with fiberglass construction and adjustable settings.',
    image: '🏋️',
    category: 'Bars',
  },
  {
    id: 4,
    name: 'Training Vault Table',
    price: 1899.99,
    description: 'Height-adjustable vault table with premium cushioning for safe landings.',
    image: '🎯',
    category: 'Vaults',
  },
  {
    id: 5,
    name: 'Folding Gymnastics Mat',
    price: 149.99,
    description: 'Portable folding mat ideal for home practice and easy storage.',
    image: '📦',
    category: 'Mats',
  },
  {
    id: 6,
    name: 'Parallel Bars Set',
    price: 1799.99,
    description: 'Sturdy parallel bars for strength training and advanced gymnastics routines.',
    image: '💪',
    category: 'Bars',
  },
];

export default function ProductCatalog() {
  const [cart, setCart] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  return (
    <section id="products" className="py-20" style={{ backgroundColor: 'var(--secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Our Products</h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Discover our premium range of gymnastics equipment designed for athletes of all levels
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition`}
              style={{
                backgroundColor: selectedCategory === category ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
              }}
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
              className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <div className="h-48 flex items-center justify-center text-8xl" style={{
                background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`
              }}>
                {product.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                  <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{product.category}</span>
                </div>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-6 py-2 rounded-full transition"
                    style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: 'white' 
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-12 border-2 rounded-lg p-6 text-center" style={{
            backgroundColor: 'var(--secondary)',
            borderColor: 'var(--card-border)'
          }}>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              <span className="font-bold">{cart.length}</span> item(s) in cart - Total: ${' '}
              <span className="font-bold" style={{ color: 'var(--primary)' }}>
                {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
