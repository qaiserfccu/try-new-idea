'use client';

import AdminLayout from '../../components/AdminLayout';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="glass-card rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-4">Analytics & Monitoring</h1>
        <p className="text-purple-200 mb-6">
          Track site visits, user behavior, product clicks, and more.
        </p>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl text-purple-200">Coming Soon</p>
          <p className="text-purple-300 mt-2">
            Analytics features including visitor tracking, location data, and traffic graphs will be available here
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
