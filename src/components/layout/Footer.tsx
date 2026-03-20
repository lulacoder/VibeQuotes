"use client";

import Link from "next/link";
import { Heart, Compass } from "@phosphor-icons/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)] transition-colors duration-300">
      <div className="golden-line" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
          <Compass weight="duotone" className="h-4 w-4 text-[var(--color-accent-primary)]" />
          <span className="font-display text-base font-semibold">VibeQuotes</span>
        </Link>
        <p className="flex items-center gap-2 text-[var(--color-text-muted)]">
          Curated wisdom, stored locally
          <Heart weight="fill" className="h-3 w-3 text-[var(--color-accent-warm)]" />
          {year}
        </p>
      </div>
    </footer>
  );
}
