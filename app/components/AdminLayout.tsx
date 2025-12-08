'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin/dashboard');
    } else if (!isAdmin) {
      router.push('/user/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Admin Sidebar */}
          <div className="md:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto purple-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                  👑
                </div>
                <h3 className="text-lg font-semibold text-white">Admin Panel</h3>
                <p className="text-sm text-purple-300">{user?.email}</p>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📦 Orders
                </Link>
                <Link
                  href="/admin/products"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  🛍️ Products
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  👥 Users
                </Link>
                <Link
                  href="/admin/analytics"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📈 Analytics
                </Link>
                <Link
                  href="/admin/promotions"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  🎁 Promotions
                </Link>
                <Link
                  href="/admin/contacts"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📧 Contacts
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
