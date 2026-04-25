'use client';

import { useEffect, useState } from 'react';
import { StorageKeys } from '../../lib/storage-keys';

type ThemeId = 'dbui-light' | 'dbui-dark';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>('dbui-light');

  useEffect(() => {
    const saved = localStorage.getItem(StorageKeys.THEME) as ThemeId | null;
    const next: ThemeId = saved === 'dbui-dark' ? 'dbui-dark' : 'dbui-light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, []);

  function applyTheme(next: ThemeId) {
    setTheme(next);
    localStorage.setItem(StorageKeys.THEME, next);
    document.documentElement.setAttribute('data-theme', next);
  }

  const isDark = theme === 'dbui-dark';

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={() => applyTheme(isDark ? 'dbui-light' : 'dbui-dark')}
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
