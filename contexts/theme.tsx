'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ dark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sura-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('sura-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
