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
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
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
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-8xl">
                {product.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="text-sm text-blue-600 font-semibold">{product.category}</span>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
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
          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-700">
              <span className="font-bold">{cart.length}</span> item(s) in cart - Total: ${' '}
              <span className="font-bold text-blue-600">
                {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
