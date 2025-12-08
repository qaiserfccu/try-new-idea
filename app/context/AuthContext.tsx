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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('chiltanpure_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if admin login
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrator',
        email: DEFAULT_ADMIN.email,
        phone: '',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUser(adminUser);
      localStorage.setItem('chiltanpure_user', JSON.stringify(adminUser));
      return true;
    }
    
    // For regular users, check localStorage "database"
    const users = JSON.parse(localStorage.getItem('chiltanpure_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('chiltanpure_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('chiltanpure_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      email,
      phone: phone || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store password separately (in real app, this would be hashed on backend)
    const passwords = JSON.parse(localStorage.getItem('chiltanpure_passwords') || '{}');
    passwords[email] = password;
    localStorage.setItem('chiltanpure_passwords', JSON.stringify(passwords));
    
    // Add user to users list
    users.push(newUser);
    localStorage.setItem('chiltanpure_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('chiltanpure_user', JSON.stringify(newUser));
    return true;
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
