'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Compass, MagnifyingGlass, Heart } from '@phosphor-icons/react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/search', label: 'Archive', icon: MagnifyingGlass },
  { href: '/likes', label: 'Saved', icon: Heart },
];

export function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/90 backdrop-blur-xl transition-colors duration-300">
      <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-accent-primary)] transition-all duration-300 group-hover:border-[var(--color-border-hover)] group-hover:shadow-[0_0_12px_rgba(212,165,74,0.15)]">
            <Compass weight="duotone" className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
            VibeQuotes
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-3 py-2 text-[0.825rem] font-medium transition-all duration-200',
                    active
                      ? 'text-[var(--color-accent-primary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  )}
                >
                  <link.icon
                    weight={active ? 'fill' : 'regular'}
                    className="h-[15px] w-[15px]"
                  />
                  <span className="hidden sm:inline">{link.label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 -bottom-[9px] h-[2px] rounded-full bg-[var(--color-accent-primary)]"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="ml-1 h-5 w-px bg-[var(--color-border)]" />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
