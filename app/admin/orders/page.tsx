'use client';

import AdminLayout from '../../components/AdminLayout';

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Order Management</h1>
        <p className="text-purple-200 mb-6">
          Manage all customer orders, update statuses, and track shipments.
        </p>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <p className="text-xl text-purple-200">Coming Soon</p>
          <p className="text-purple-300 mt-2">
            Order management features will be available here
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
