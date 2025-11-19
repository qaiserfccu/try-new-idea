'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50" style={{ 
      backgroundColor: 'var(--nav-bg)', 
      boxShadow: '0 1px 3px var(--nav-shadow)' 
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>GymLab</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition">
              Home
            </Link>
            <Link href="#products" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition">
              Products
            </Link>
            <Link href="#about" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition">
              About
            </Link>
            <Link href="#contact" style={{ color: 'var(--text-secondary)' }} className="hover:opacity-80 transition">
              Contact
            </Link>
            <ThemeSwitcher />
            <Link
              href="#products"
              className="px-6 py-2 rounded-full transition"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white' 
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
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
                style={{ color: 'var(--text-secondary)' }}
                className="hover:opacity-80 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#products"
                style={{ color: 'var(--text-secondary)' }}
                className="hover:opacity-80 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="#about"
                style={{ color: 'var(--text-secondary)' }}
                className="hover:opacity-80 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#contact"
                style={{ color: 'var(--text-secondary)' }}
                className="hover:opacity-80 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex justify-center">
                <ThemeSwitcher />
              </div>
              <Link
                href="#products"
                className="px-6 py-2 rounded-full transition text-center"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white' 
                }}
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
