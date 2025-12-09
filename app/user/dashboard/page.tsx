'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/UserLayout';
import { Order } from '../../lib/types';
import Link from 'next/link';

export default function UserDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    // Load orders from localStorage
    const allOrders = JSON.parse(localStorage.getItem('chiltanpure_orders') || '[]');
    const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
    
    setOrders(userOrders.slice(0, 5)); // Show last 5 orders
    
    // Calculate stats
    const pending = userOrders.filter((o: Order) => 
      ['pending', 'confirmed', 'processing'].includes(o.status)
    ).length;
    const completed = userOrders.filter((o: Order) => o.status === 'delivered').length;
    const totalSpent = userOrders.reduce((sum: number, o: Order) => sum + o.total, 0);
    
    setStats({
      totalOrders: userOrders.length,
      pendingOrders: pending,
      completedOrders: completed,
      totalSpent,
    });
  }, [user]);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-purple-200">
            Here&apos;s an overview of your account and recent activity.
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
                <p className="text-purple-300 text-sm mb-1">Pending</p>
                <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-white">{stats.completedOrders}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-white">Rs. {stats.totalSpent.toFixed(2)}</p>
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
              href="/user/orders"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              View All →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-purple-200 mb-4">No orders yet</p>
              <Link
                href="/#products"
                className="inline-block purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
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
                  <Link
                    href={`/user/orders?order=${order.id}`}
                    className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/user/orders"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Orders</h3>
            <p className="text-purple-300 text-sm">
              View and track your order status
            </p>
          </Link>

          <Link
            href="/user/addresses"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Manage Addresses</h3>
            <p className="text-purple-300 text-sm">
              Add or edit delivery addresses
            </p>
          </Link>

          <Link
            href="/user/wishlist"
            className="glass-card rounded-xl p-6 hover:bg-white/10 transition group"
          >
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Wishlist</h3>
            <p className="text-purple-300 text-sm">
              Save your favorite products
            </p>
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}
