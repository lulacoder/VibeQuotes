'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';
import { Orbit, Search, Heart } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Orbit },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/likes', label: 'Saved', icon: Heart },
];

export function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[rgba(5,5,7,0.72)] backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00d4ff,#7c3aed)] text-black shadow-[0_10px_40px_rgba(0,212,255,0.22)]">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--color-text-muted)]">Archive</p>
            <p className="text-lg font-black tracking-[-0.04em] text-[var(--color-text-primary)]">VibeQuotes</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all',
                  active
                    ? 'bg-white/10 text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
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
