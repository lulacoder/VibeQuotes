'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Compass, MagnifyingGlass, Heart } from '@phosphor-icons/react';
import { ThemeToggle } from './ThemeToggle';
import { useQuotes } from '@/context/QuotesContext';
import { useState } from 'react';

const navLinks = [
  { href: '/',       label: 'Home',    icon: Compass },
  { href: '/search', label: 'Archive', icon: MagnifyingGlass },
  { href: '/likes',  label: 'Saved',   icon: Heart },
];

export function MinimalHeader() {
  const pathname  = usePathname();
  const { likedCount } = useQuotes();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border-hard)] bg-[var(--color-bg-primary)]/90 backdrop-blur-xl transition-colors duration-300">
        <nav className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5 lg:px-10">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-primary)] text-white shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent-primary)_30%,transparent)] transition-all duration-300 group-hover:shadow-[0_0_28px_color-mix(in_srgb,var(--color-accent-primary)_45%,transparent)]">
              <Compass weight="bold" className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              VibeQuotes
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isLikes = link.href === '/likes';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] text-[var(--color-accent-primary)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  <link.icon weight={active ? 'fill' : 'regular'} className="h-[15px] w-[15px]" />
                  <span>{link.label}</span>
                  {isLikes && likedCount > 0 && (
                    <span className="badge-count">{likedCount > 99 ? '99+' : likedCount}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="icon-btn md:hidden"
              aria-label="Toggle menu"
            >
              <span className="relative block h-4 w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 origin-center bg-current transition-all duration-200 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[3px]"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-current transition-all duration-200 ${
                    open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 origin-center bg-current transition-all duration-200 ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[3px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed left-4 right-4 top-[68px] z-50 overflow-hidden rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-2 shadow-2xl md:hidden"
            >
              {navLinks.map((link, i) => {
                const active = pathname === link.href;
                const isLikes = link.href === '/likes';
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] text-[var(--color-accent-primary)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      )}
                    >
                      <link.icon weight={active ? 'fill' : 'regular'} className="h-4 w-4" />
                      <span className="flex-1">{link.label}</span>
                      {isLikes && likedCount > 0 && (
                        <span className="badge-count">{likedCount}</span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
