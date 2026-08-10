import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs cursor-pointer ${className}`}
      title={`Switch theme (currently ${theme})`}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun className="w-4 h-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0 text-zinc-700" />
        <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100 text-zinc-300" />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-normal">
          {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
