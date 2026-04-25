'use client';

import { useEffect, useState } from 'react';

type ThemeId = 'core' | 'night';

const STORAGE_KEY = 'nexdoz-theme';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('core');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved !== 'core' && saved !== 'night') {
      document.documentElement.setAttribute('data-theme', 'core');
      return;
    }
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function applyTheme(next: ThemeId) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
  }

  const isDark = theme === 'night';

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={() => applyTheme(isDark ? 'core' : 'night')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v3" />
          <path d="M12 19v3" />
          <path d="M2 12h3" />
          <path d="M19 12h3" />
          <path d="m4.9 4.9 2.2 2.2" />
          <path d="m16.9 16.9 2.2 2.2" />
          <path d="m19.1 4.9-2.2 2.2" />
          <path d="m7.1 16.9-2.2 2.2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 14.8A9 9 0 1 1 9.2 3a7 7 0 0 0 11.8 11.8z" />
        </svg>
      )}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
