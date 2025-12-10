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
    } finally {
      setSyncing(false);
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
