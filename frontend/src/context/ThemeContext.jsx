import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark', // 'dark' | 'light' | 'system'
  resolvedTheme: 'dark', // 'dark' | 'light'
  setTheme: () => {},
  toggleTheme: () => {},
});

const THEME_STORAGE_KEY = 'apexradio-theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
    } catch {
      // ignore storage errors
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        setResolvedTheme('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        setResolvedTheme('light');
      }
    };

    applyTheme();

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // if system, toggle to the opposite of resolved
      return resolvedTheme === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
