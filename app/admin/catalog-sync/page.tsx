'use client';

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { CHILTANPURE_REFERRAL_URL } from '../../lib/constants';

interface Product {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  chiltanpureUrl: string;
  images: string[];
  category: string;
  stock: number;
}

export default function CatalogSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('Syncing products from ChiltanPure...');
    
    try {
      // In a real implementation, this would fetch from ChiltanPure API
      // For now, we'll simulate with sample data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleProducts: Product[] = [
        {
          name: 'Organic Honey 500g',
          description: 'Pure organic honey sourced from the finest beehives in Pakistan. Rich in antioxidants and natural sweetness.',
          price: 1500,
          originalPrice: 1800,
          chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/organic-honey`,
          images: ['https://chiltanpure.com/cdn/shop/products/organic-honey-500g.jpg'],
          category: 'Food & Beverages',
          stock: 50
        },
        {
          name: 'Extra Virgin Olive Oil',
          description: 'Cold-pressed extra virgin olive oil from organic farms. Perfect for cooking and salads.',
          price: 2500,
          originalPrice: 3000,
          chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/olive-oil`,
          images: ['https://chiltanpure.com/cdn/shop/products/olive-oil.jpg'],
          category: 'Food & Beverages',
          stock: 30
        },
        {
          name: 'Natural Face Serum',
          description: 'Organic face serum with vitamin C and hyaluronic acid. Anti-aging and hydrating formula.',
          price: 1800,
          originalPrice: 2200,
          chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/face-serum`,
          images: ['https://chiltanpure.com/cdn/shop/products/face-serum.jpg'],
          category: 'Beauty & Skincare',
          stock: 40
        },
        {
          name: 'Herbal Hair Oil',
          description: 'Natural hair oil with coconut, almond, and essential oils. Promotes hair growth and shine.',
          price: 1200,
          originalPrice: 1500,
          chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/hair-oil`,
          images: ['https://chiltanpure.com/cdn/shop/products/hair-oil.jpg'],
          category: 'Hair Care',
          stock: 60
        },
      ];
      
      setProducts(sampleProducts);
      setSyncStatus(`Successfully synced ${sampleProducts.length} products from ChiltanPure!`);
    } catch (error) {
      setSyncStatus('Error syncing products. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleImportProduct = async (product: Product) => {
    // In a real implementation, this would save to database via API
    alert(`Importing: ${product.name}\nPrice: Rs. ${product.price}\nURL: ${product.chiltanpureUrl}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            ChiltanPure Catalog Sync
          </h1>
          <p className="text-green-200 mb-6">
            Sync products directly from ChiltanPure.com with referral tracking.
            All product images and information will match the source.
          </p>
          
          <div className="glass rounded-lg p-4 mb-4 bg-green-500/10 border-green-500/30">
            <p className="text-sm font-medium text-green-300 mb-2">Referral URL:</p>
            <code className="text-white font-mono text-sm break-all block bg-black/30 p-3 rounded">
              {CHILTANPURE_REFERRAL_URL}
            </code>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="purple-gradient text-white px-8 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50 font-semibold shadow-lg"
          >
            {syncing ? '🔄 Syncing...' : '🔄 Sync Products from ChiltanPure'}
          </button>

          {syncStatus && (
            <div className={`mt-4 p-4 rounded-lg ${
              syncStatus.includes('Error') 
                ? 'bg-red-500/20 border border-red-500 text-red-300'
                : 'bg-green-500/20 border border-green-500 text-green-300'
            }`}>
              {syncStatus}
            </div>
          )}
        </div>

        {/* Products List */}
        {products.length > 0 && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Synced Products ({products.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product, index) => (
                <div 
                  key={index}
                  className="glass rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                  
                  <p className="text-green-200 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 text-sm">Price:</span>
                      <div className="flex items-center gap-2">
                        {product.originalPrice && (
                          <span className="text-green-400 text-sm line-through">
                            Rs. {product.originalPrice}
                          </span>
                        )}
                        <span className="text-white font-bold text-lg">
                          Rs. {product.price}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 text-sm">Stock:</span>
                      <span className="text-white font-semibold">
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-green-300 text-xs mb-1">ChiltanPure URL:</p>
                    <a 
                      href={product.chiltanpureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 text-xs break-all underline"
                    >
                      {product.chiltanpureUrl}
                    </a>
                  </div>
                  
                  <button
                    onClick={() => handleImportProduct(product)}
                    className="w-full purple-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-semibold"
                  >
                    ✓ Import to Store
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            ℹ️ About Catalog Sync
          </h2>
          <div className="space-y-3 text-green-200">
            <p>• All products synced from ChiltanPure will include the referral code</p>
            <p>• Product images and information will match ChiltanPure.com exactly</p>
            <p>• Prices are displayed in Pakistani Rupees (PKR Rs.)</p>
            <p>• Stock levels can be adjusted after import</p>
            <p>• Products maintain a link to their source on ChiltanPure</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
