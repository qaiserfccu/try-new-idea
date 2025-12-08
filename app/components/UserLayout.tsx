'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/user/dashboard');
    } else if (isAdmin) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto purple-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                <p className="text-sm text-purple-300">{user?.email}</p>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/user/dashboard"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/user/orders"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📦 My Orders
                </Link>
                <Link
                  href="/user/profile"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  👤 Profile
                </Link>
                <Link
                  href="/user/addresses"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  📍 Addresses
                </Link>
                <Link
                  href="/user/wishlist"
                  className="block px-4 py-3 rounded-lg text-purple-200 hover:bg-white/10 transition"
                >
                  ❤️ Wishlist
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
