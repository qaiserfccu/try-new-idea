'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        const success = await signup(formData.name, formData.email, formData.password, formData.phone);
        if (success) {
          alert('Account created successfully!');
          router.push('/');
        } else {
          setError('Failed to create account. Please try again.');
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          router.push('/');
        } else {
          setError('Invalid email or password.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoPopulate = (email: string, password: string, name: string = '') => {
    setFormData({
      name,
      email,
      password,
      phone: '',
    });
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-green-200">
              {isSignup
                ? 'Sign up to start shopping organic products'
                : 'Login to your ChiltanPure account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {!isSignup && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm font-medium mb-3">Quick Login (Test Users):</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleAutoPopulate('admin@trynewidea.com', 'Admin123', 'Admin User')}
                  className="w-full text-left px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-200 text-sm transition"
                >
                  👑 Admin: admin@trynewidea.com / Admin123
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoPopulate('user@trynewidea.com', 'User123', 'Regular User')}
                  className="w-full text-left px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-200 text-sm transition"
                >
                  👤 User: user@trynewidea.com / User123
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoPopulate('manager@trynewidea.com', 'Manager123', 'Manager User')}
                  className="w-full text-left px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-200 text-sm transition"
                >
                  📊 Manager: manager@trynewidea.com / Manager123
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-green-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required={isSignup}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-green-300/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-green-300"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-200 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-green-300/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-green-300"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-200 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-green-300/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-green-300"
                placeholder="••••••••"
              />
            </div>

            {isSignup && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-green-200 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-green-300/30 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-green-300"
                  placeholder="+92 300 1234567"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full purple-gradient text-white px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-green-300 hover:text-green-200 transition"
            >
              {isSignup
                ? 'Already have an account? Login'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/checkout"
              className="text-green-400 hover:text-green-300 transition text-sm"
            >
              Continue as guest →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
