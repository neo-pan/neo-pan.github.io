'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
  i18n: I18nRuntimeConfig;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale?: Record<string, string>;
}

export default function Navigation({
  items,
  siteTitle,
  enableOnePageMode,
  i18n,
  itemsByLocale,
  siteTitleByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const messages = useMessages();
  const visibleSections = useRef(new Set<string>());
  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(
    () => itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items,
    [i18n.defaultLocale, items, itemsByLocale, resolvedLocale]
  );

  const effectiveSiteTitle = useMemo(
    () => siteTitleByLocale?.[resolvedLocale] || siteTitleByLocale?.[i18n.defaultLocale] || siteTitle,
    [i18n.defaultLocale, resolvedLocale, siteTitle, siteTitleByLocale]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!enableOnePageMode) return;

    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    visibleSections.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.current.add(entry.target.id);
          else visibleSections.current.delete(entry.target.id);
        });

        const firstVisible = effectiveItems.find(
          (item) => item.type === 'page' && visibleSections.current.has(item.target)
        );
        if (firstVisible) {
          setActiveHash(firstVisible.target === 'about' ? '' : `#${firstVisible.target}`);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    effectiveItems.forEach((item) => {
      if (item.type === 'page') {
        const element = document.getElementById(item.target);
        if (element) observer.observe(element);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      observer.disconnect();
    };
  }, [enableOnePageMode, effectiveItems]);

  const isActive = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode
      ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
      : item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href);

  const getHref = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  return (
    <Disclosure as="nav" className="fixed inset-x-0 top-0 z-50">
      {({ open }) => (
        <>
          <div
            className={cn(
              'transition-colors duration-200',
              scrolled || open
                ? 'border-b border-neutral-200/70 bg-background/95 shadow-sm backdrop-blur-xl dark:border-neutral-800'
                : 'bg-background/90 backdrop-blur-sm'
            )}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between lg:h-20">
                <Link
                  href="/"
                  className="flex-shrink-0 font-serif text-xl font-semibold text-primary transition-colors hover:text-accent lg:text-2xl"
                >
                  {effectiveSiteTitle}
                </Link>

                <div className="hidden items-center space-x-3 lg:flex">
                  <div className="flex items-baseline space-x-1">
                    {effectiveItems.map((item) => {
                      const active = isActive(item);
                      const href = getHref(item);
                      return (
                        <Link
                          key={item.target}
                          href={href}
                          prefetch
                          aria-current={active ? 'page' : undefined}
                          onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                              ? 'bg-accent/10 text-primary'
                              : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary dark:text-neutral-300 dark:hover:bg-neutral-800'
                          )}
                        >
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                  <LanguageToggle i18n={i18n} />
                  <ThemeToggle />
                </div>

                <div className="flex items-center space-x-2 lg:hidden">
                  <LanguageToggle i18n={i18n} />
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:text-neutral-300 dark:hover:bg-neutral-800">
                    <span className="sr-only">{messages.navigation.openMainMenu}</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="border-b border-neutral-200/70 bg-background/95 shadow-sm backdrop-blur-xl dark:border-neutral-800 lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {effectiveItems.map((item) => {
                const active = isActive(item);
                const href = getHref(item);
                return (
                  <Disclosure.Button
                    key={item.target}
                    as={Link}
                    href={href}
                    prefetch
                    aria-current={active ? 'page' : undefined}
                    onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                      active
                        ? 'border-l-4 border-accent bg-accent/10 text-primary'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary dark:text-neutral-300 dark:hover:bg-neutral-800'
                    )}
                  >
                    {item.title}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
