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
      // Call the scraping API with dryRun to preview products
      const response = await fetch('/api/scrape?dryRun=true');
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to sync products');
      }
      
      setProducts(data.products || []);
      setSyncStatus(`Successfully synced ${data.productsScraped} products from ChiltanPure!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncStatus(`Error syncing products: ${errorMessage}`);
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleImportProduct = async (product: Product) => {
    try {
      // Trigger actual import without dryRun
      const response = await fetch('/api/scrape', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to import products');
      }
      
      alert(`Import successful!\nCreated: ${data.created}\nUpdated: ${data.updated}\nErrors: ${data.errors}`);
      
      // Refresh the products list
      await handleSync();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error importing products: ${errorMessage}`);
      console.error('Import error:', error);
    }
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Synced Products ({products.length})
              </h2>
              <button
                onClick={handleImportProduct}
                className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition font-semibold shadow-lg"
              >
                ✓ Import All Products to Store
              </button>
            </div>
            
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
                  
                  <a 
                    href={product.chiltanpureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition font-semibold text-center block"
                  >
                    🔗 View on ChiltanPure
                  </a>
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
