"use client";

import Link from "next/link";
import { Heart, Orbit } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-sm text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <Orbit className="h-4 w-4 text-[var(--color-accent-primary)]" />
          <span>VibeQuotes</span>
        </Link>
        <p className="flex items-center gap-2">
          Built for local browsing <Heart className="h-3.5 w-3.5 fill-[var(--color-accent-tertiary)] text-[var(--color-accent-tertiary)]" /> {year}
        </p>
      </div>
    </footer>
  );
}
