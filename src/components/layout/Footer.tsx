"use client";

import Link from "next/link";
import { Compass } from "@phosphor-icons/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent-primary)] text-white transition-all duration-300 group-hover:shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent-primary)_40%,transparent)]">
            <Compass weight="bold" className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-base font-bold text-[var(--color-text-primary)]">
            VibeQuotes
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <span className="section-eyebrow">Curated wisdom, stored locally</span>
          <span className="h-4 w-px bg-[var(--color-border-hard)]" />
          <span>{year}</span>
        </div>
      </div>
    </footer>
  );
}
