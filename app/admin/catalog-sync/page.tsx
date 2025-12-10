'use client';

import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
  discount: number;
  created_at?: string;
  updated_at?: string;
}

interface SyncResult {
  totalProducts: number;
  newProducts: number;
  updatedProducts: number;
  errors: string[];
}

export default function CatalogSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [lastSync, setLastSync] = useState<string>('');

  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('Starting catalog synchronization...');
    setSyncResult(null);

    try {
      // Step 1: Fetch products from ChiltanPure API/website
      setSyncStatus('Fetching products from ChiltanPure...');
      const response = await fetch('/api/admin/catalog-sync', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSyncResult(result);
      setLastSync(new Date().toLocaleString());
      setSyncStatus('Catalog synchronization completed successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('Error during synchronization. Please try again.');
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

  const handleImportProduct = async () => {
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Catalog Synchronization</h1>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {syncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Syncing...</span>
              </>
            ) : (
              <span>Sync Catalog</span>
            )}
          </button>
        </div>

        {/* Status Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
          <div className="space-y-2">
            <p className="text-gray-600">{syncStatus}</p>
            {lastSync && (
              <p className="text-sm text-gray-500">Last sync: {lastSync}</p>
            )}
          </div>
        </div>

        {/* Results Display */}
        {syncResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sync Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{syncResult.totalProducts}</div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{syncResult.newProducts}</div>
                <div className="text-sm text-gray-600">New Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{syncResult.updatedProducts}</div>
                <div className="text-sm text-gray-600">Updated Products</div>
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

            {syncResult.errors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-red-600 mb-2">Errors</h3>
                <ul className="list-disc list-inside text-red-600">
                  {syncResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Information Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">About Catalog Sync</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">What gets synchronized:</h4>
              <ul className="text-sm space-y-1">
                <li>• Product names and descriptions</li>
                <li>• Pricing information</li>
                <li>• Product images</li>
                <li>• Categories and tags</li>
                <li>• Stock availability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sync behavior:</h4>
              <ul className="text-sm space-y-1">
                <li>• New products are added automatically</li>
                <li>• Existing products are updated</li>
                <li>• Removed products stay in catalog</li>
                <li>• No products are deleted automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
