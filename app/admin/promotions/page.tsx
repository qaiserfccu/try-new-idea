'use client';

import AdminLayout from '../../components/AdminLayout';

export default function AdminPromotionsPage() {
  return (
    <AdminLayout>
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Promotions & Discounts</h1>
        <p className="text-purple-200 mb-6">
          Create and manage promotional codes and discounts.
        </p>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-xl text-purple-200">Coming Soon</p>
          <p className="text-purple-300 mt-2">
            Promotion management features will be available here
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
