'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/likes', label: 'Favorites' },
];

export function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-var(--bg-primary)/80 border-b border-var(--divider)">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-var(--text-primary)"
        >
          VibeQuotes
        </Link>
        <ul className="flex gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors',
                  pathname === link.href
                    ? 'text-var(--text-primary) font-semibold'
                    : 'text-var(--text-secondary) hover:text-var(--text-primary)'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
