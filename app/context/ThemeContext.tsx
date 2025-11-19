'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 'light' | 'dark' | 'ocean';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    // Initialize theme from localStorage if available
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('gymlab-theme') as ThemeName;
      if (savedTheme && ['light', 'dark', 'ocean'].includes(savedTheme)) {
        return savedTheme;
      }
    }
    return 'light';
  });

  useEffect(() => {
    // Save theme to localStorage and update DOM
    localStorage.setItem('gymlab-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
