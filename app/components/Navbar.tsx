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
    <nav className="glass-dark sticky top-0 z-50 border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">C</span>
            </div>
            <span className="text-2xl font-bold gradient-text">ChiltanPure</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-green-100 hover:text-white transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="#products" className="text-green-100 hover:text-white transition-colors duration-200 font-medium">
              Products
            </Link>
            <Link href="#about" className="text-green-100 hover:text-white transition-colors duration-200 font-medium">
              About
            </Link>
            <Link href="#contact" className="text-green-100 hover:text-white transition-colors duration-200 font-medium">
              Contact
            </Link>
            <Link
              href="/cart"
              className="relative text-green-100 hover:text-white transition-colors duration-200 flex items-center gap-2 font-medium"
            >
              <span className="text-xl">🛒</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-green-100 hover:text-white transition-colors duration-200 font-medium">
                  👤 Profile
                </Link>
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="text-green-100 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/user/dashboard"
                    className="text-green-100 hover:text-white transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <span className="text-green-200 text-sm px-3 py-1 bg-green-500/20 rounded-full">
                  Hi, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-green-100 hover:text-red-400 transition-colors duration-200 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-green-100 hover:text-white transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            )}
            {mounted && <ThemeToggle />}
            <Link
              href="#products"
              className="purple-gradient text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-green-100 hover:text-white transition-colors"
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
          <div className="md:hidden pb-4 pt-2 border-t border-green-500/20">
            <div className="flex flex-col space-y-3">{" "}
              <Link
                href="/"
                className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#products"
                className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#about"
                className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 flex items-center gap-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart {totalItems > 0 && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{totalItems}</span>}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  {isAdmin ? (
                    <Link
                      href="/admin/dashboard"
                      className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/user/dashboard"
                      className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  )}
                  <span className="text-green-200 text-sm px-3 py-2 bg-green-500/20 rounded-lg">Hi, {user?.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-green-100 hover:text-red-400 transition-colors text-left px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-green-100 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-500/10 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              {mounted && (
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-green-200 text-sm font-medium">Theme:</span>
                  <ThemeToggle />
                </div>
              )}
              <Link
                href="#products"
                className="purple-gradient text-white px-6 py-3 rounded-full hover:opacity-90 transition text-center font-semibold shadow-lg"
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
