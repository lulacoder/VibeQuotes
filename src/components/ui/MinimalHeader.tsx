'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Orbit, Search, Heart } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Orbit },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/likes', label: 'Saved', icon: Heart },
];

export function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(15,15,15,0.92)] backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-accent-primary)]">
            <Orbit className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">VibeQuotes</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-white/6 text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
