'use client';

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useSyncExternalStore } from 'react';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const messages = useMessages();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const labels: Record<Theme, string> = {
    system: messages.theme.system,
    light: messages.theme.light,
    dark: messages.theme.dark,
  };

  const cycleTheme = () => {
    const order: Theme[] = ['system', 'light', 'dark'];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  };

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-background text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
      >
        <ComputerDesktopIcon className="h-4 w-4" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg',
        'border border-neutral-200 bg-background text-neutral-600 hover:bg-neutral-50 hover:text-primary',
        'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white',
        'transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
      title={`${messages.theme.currentTheme}: ${labels[theme]}. ${messages.theme.cycleTheme}.`}
      aria-label={`${messages.theme.currentTheme}: ${labels[theme]}. ${messages.theme.cycleTheme}.`}
    >
      {theme === 'system' ? (
        <ComputerDesktopIcon className="h-4 w-4" />
      ) : theme === 'dark' ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
    </button>
  );
}
