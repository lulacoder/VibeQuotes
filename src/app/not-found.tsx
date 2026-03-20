"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { House, MagnifyingGlass, Compass } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-4 transition-colors duration-300">
      <div className="grain-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, bounce: 0.4 }}
          className="relative mb-8"
        >
          <span className="font-display text-[120px] font-semibold leading-none text-[var(--color-text-primary)] md:text-[160px]">
            404
          </span>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-[var(--color-accent-primary)]">
            <Compass weight="duotone" className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 transition-colors duration-300"
        >
          <h1 className="mb-3 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Page not found
          </h1>

          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
            Looks like this page wandered off.
          </p>

          <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-left">
            <p className="quote-text text-base text-[var(--color-text-primary)]">
              &ldquo;Not all those who wander are lost.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">— J.R.R. Tolkien</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-primary">
              <House className="h-4 w-4" />
              Go home
            </Link>

            <Link href="/search" className="btn-secondary">
              <MagnifyingGlass className="h-4 w-4" />
              Search quotes
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
