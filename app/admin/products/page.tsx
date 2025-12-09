'use client';

import AdminLayout from '../../components/AdminLayout';
import { CHILTANPURE_REFERRAL_URL } from '../../lib/constants';

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Product Management</h1>
          <p className="text-purple-200 mb-6">
            Manage products, sync from ChiltanPure, and update inventory.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Sync from ChiltanPure</h2>
          <p className="text-purple-200 mb-4">
            Import products directly from ChiltanPure using the referral link:
          </p>
          <div className="glass rounded-lg p-4 mb-4">
            <p className="text-sm text-purple-300 mb-2">Referral URL:</p>
            <code className="text-white font-mono text-sm break-all">{CHILTANPURE_REFERRAL_URL}</code>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <p className="text-xl text-purple-200">Coming Soon</p>
            <p className="text-purple-300 mt-2">
              Product sync and CRUD operations will be available here
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
