'use client';

import AdminLayout from '../../components/AdminLayout';

export default function AdminContactsPage() {
  return (
    <AdminLayout>
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Contact Submissions</h1>
        <p className="text-purple-200 mb-6">
          View and manage contact form submissions from users.
        </p>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <p className="text-xl text-purple-200">Coming Soon</p>
          <p className="text-purple-300 mt-2">
            Contact management features will be available here
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
