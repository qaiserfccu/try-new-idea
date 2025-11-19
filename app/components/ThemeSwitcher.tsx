'use client';

import { useTheme, ThemeName } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes: { name: ThemeName; label: string; icon: string }[] = [
    { name: 'light', label: 'Light', icon: '☀️' },
    { name: 'dark', label: 'Dark', icon: '🌙' },
    { name: 'ocean', label: 'Ocean', icon: '🌊' },
  ];

  const currentIndex = themes.findIndex((t) => t.name === theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  return (
    <button
      onClick={() => setTheme(nextTheme.name)}
      className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
      style={{
        backgroundColor: 'var(--secondary)',
        color: 'var(--text-primary)',
      }}
      title={`Switch to ${nextTheme.label} theme`}
      aria-label={`Switch to ${nextTheme.label} theme`}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-hover)'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary)'}
    >
      <span className="text-xl">{nextTheme.icon}</span>
      <span className="hidden sm:inline text-sm font-medium">{nextTheme.label}</span>
    </button>
  );
}
