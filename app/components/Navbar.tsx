'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false });

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="glass-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold gradient-text">ChiltanPure</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-purple-200 hover:text-white transition">
              Home
            </Link>
            <Link href="#products" className="text-purple-200 hover:text-white transition">
              Products
            </Link>
            <Link href="#about" className="text-purple-200 hover:text-white transition">
              About
            </Link>
            <Link href="#contact" className="text-purple-200 hover:text-white transition">
              Contact
            </Link>
            <Link
              href="/cart"
              className="text-purple-200 hover:text-white transition flex items-center gap-1"
            >
              🛒 Cart {totalItems > 0 && <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{totalItems}</span>}
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="text-purple-200 hover:text-white transition"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/user/dashboard"
                    className="text-purple-200 hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-purple-200 text-sm">Hi, {user?.name}</span>
                <button
                  onClick={logout}
                  className="text-purple-200 hover:text-white transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-purple-200 hover:text-white transition"
              >
                Login
              </Link>
            )}
            {mounted && <ThemeToggle />}
            <Link
              href="#products"
              className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-purple-200 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-purple-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#products"
                className="text-purple-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#about"
                className="text-purple-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-purple-200 hover:text-white transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className="text-purple-200 hover:text-white transition flex items-center gap-1"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart {totalItems > 0 && <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{totalItems}</span>}
              </Link>
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin/dashboard"
                      className="text-purple-200 hover:text-white transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/user/dashboard"
                      className="text-purple-200 hover:text-white transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}
                  <span className="text-purple-200 text-sm">Hi, {user?.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-purple-200 hover:text-white transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-purple-200 hover:text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {mounted && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200 text-sm">Theme:</span>
                  <ThemeToggle />
                </div>
              )}
              <Link
                href="#products"
                className="purple-gradient text-white px-6 py-2 rounded-full hover:opacity-90 transition text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
