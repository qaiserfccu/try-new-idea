'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Order, User } from '../../lib/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const orders = JSON.parse(localStorage.getItem('chiltanpure_orders') || '[]');
    const users = JSON.parse(localStorage.getItem('chiltanpure_users') || '[]');

    const pending = orders.filter((o: Order) => 
      ['pending', 'confirmed'].includes(o.status)
    ).length;

    const revenue = orders.reduce((sum: number, o: Order) => sum + o.total, 0);

    setStats({
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: revenue,
      pendingOrders: pending,
    });

    setRecentOrders(orders.slice(-5).reverse());
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard 👑
          </h1>
          <p className="text-purple-200">
            Welcome to the ChiltanPure Admin Panel. Manage your store from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">Rs. {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-purple-200">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass border border-purple-500/20 rounded-lg p-4 hover:bg-white/5 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-purple-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        order.status === 'delivered'
                          ? 'bg-green-500'
                          : order.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-purple-200 text-sm">
                      {order.items.length} item(s) • {order.paymentMethod.toUpperCase()}
                    </p>
                    <p className="text-white font-bold">Rs. {order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/orders"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Orders</h3>
            <p className="text-purple-300 text-sm">
              View and update order status
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Products</h3>
            <p className="text-purple-300 text-sm">
              Manage product catalog
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
            <p className="text-purple-300 text-sm">
              View site analytics and reports
            </p>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Default Admin Credentials</h2>
          <div className="space-y-2 text-purple-200">
            <p>📧 Email: <span className="text-white font-mono">admin@trynewidea.com</span></p>
            <p>🔐 Password: <span className="text-white font-mono">Admin123</span></p>
            <p className="text-sm text-purple-300 mt-4">
              ⚠️ Change these credentials in production for security
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
