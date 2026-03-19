"use client";

import Link from "next/link";
import { Heart, Orbit } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/8 bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <Orbit className="h-4 w-4 text-[var(--color-accent-primary)]" />
          VibeQuotes
        </Link>
        <p className="flex items-center gap-2">
          Built for offline browsing <Heart className="h-3.5 w-3.5 fill-[var(--color-accent-tertiary)] text-[var(--color-accent-tertiary)]" /> {year}
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Local data only</p>
      </div>
    </footer>
  );
}
