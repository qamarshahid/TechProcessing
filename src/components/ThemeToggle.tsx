import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-gray-100/50 dark:bg-surface/50 rounded-lg p-1 backdrop-blur-sm border border-gray-200/30 dark:border-outline/30">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === value
              ? 'bg-white dark:bg-surface2 text-accent1 dark:text-accent2 shadow-sm'
              : 'text-gray-600 dark:text-muted hover:text-accent1 dark:hover:text-accent2'
          }`}
          title={label}
          aria-label={`Switch to ${label.toLowerCase()} theme`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}