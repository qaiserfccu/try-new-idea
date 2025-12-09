'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../lib/types';
import { DEFAULT_ADMIN } from '../lib/constants';
import { generateId } from '../lib/utils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage for session persistence
    const storedUser = localStorage.getItem('chiltanpure_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const loggedInUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        postalCode: data.user.postalCode,
        createdAt: data.user.createdAt,
      };

      setUser(loggedInUser);
      localStorage.setItem('chiltanpure_user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    setUser(updatedUser);
    localStorage.setItem('chiltanpure_user', JSON.stringify(updatedUser));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem('chiltanpure_users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('chiltanpure_users', JSON.stringify(users));
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const newUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        city: data.user.city,
        postalCode: data.user.postalCode,
        createdAt: data.user.createdAt,
      };

      setUser(newUser);
      localStorage.setItem('chiltanpure_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chiltanpure_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
