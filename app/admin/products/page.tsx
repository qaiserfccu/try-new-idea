'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { CHILTANPURE_REFERRAL_URL } from '../../lib/constants';

export default function AdminProductsPage() {
  const [products] = useState([
    {
      id: 1,
      name: 'Organic Honey',
      price: 1500,
      stock: 50,
      category: 'Food & Beverages',
      chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/organic-honey`
    },
    {
      id: 2,
      name: 'Organic Olive Oil',
      price: 2500,
      stock: 30,
      category: 'Food & Beverages',
      chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/olive-oil`
    },
    {
      id: 3,
      name: 'Natural Face Serum',
      price: 1800,
      stock: 40,
      category: 'Beauty & Skincare',
      chiltanpureUrl: `${CHILTANPURE_REFERRAL_URL}/products/face-serum`
    },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-green-200">
                Manage products, sync from ChiltanPure, and update inventory.
              </p>
            </div>
            <Link
              href="/admin/catalog-sync"
              className="purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition font-semibold shadow-lg"
            >
              🔄 Catalog Sync
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Current Products</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-500/20">
                  <th className="text-left py-3 px-4 text-green-300 font-semibold">Product</th>
                  <th className="text-left py-3 px-4 text-green-300 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 text-green-300 font-semibold">Price</th>
                  <th className="text-right py-3 px-4 text-green-300 font-semibold">Stock</th>
                  <th className="text-right py-3 px-4 text-green-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-green-500/10 hover:bg-green-500/5">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-semibold">{product.name}</p>
                        <a 
                          href={product.chiltanpureUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-xs"
                        >
                          View on ChiltanPure →
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-white font-semibold">
                      Rs. {product.price}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        product.stock > 20 
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-green-400 hover:text-green-300 text-sm font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center text-green-300">
            <p className="text-sm">
              💡 Tip: Use Catalog Sync to import more products from ChiltanPure
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Product Information</h2>
          <div className="space-y-3 text-green-200">
            <p>✓ All products display prices in Pakistani Rupees (PKR Rs.)</p>
            <p>✓ Product images and information match ChiltanPure.com</p>
            <p>✓ Each product maintains a link to its ChiltanPure source</p>
            <p>✓ Referral code is automatically included in all ChiltanPure URLs</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
