"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search, Sparkles, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, bounce: 0.4 }}
          className="relative mb-8"
        >
          <span className="text-[120px] font-semibold leading-none text-[var(--color-text-primary)] md:text-[180px]">
            404
          </span>

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3 text-[var(--color-accent-primary)]">
            <MapPin className="h-6 w-6" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8"
        >
          <h1 className="mb-3 text-2xl font-semibold text-[var(--color-text-primary)]">
            Page not found
          </h1>

          <p className="mb-8 text-[var(--color-text-secondary)]">
            Looks like this page wandered off.
          </p>

          <div className="mb-8 rounded-[12px] border border-[var(--color-border)] p-4 text-left text-sm text-[var(--color-text-secondary)]">
            <p>
              &ldquo;Not all those who wander are lost.&rdquo;
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">— J.R.R. Tolkien</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div>
              <Link
                href="/"
                className="ui-button ui-button-primary w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </motion.div>

            <motion.div>
              <Link
                href="/search"
                className="ui-button ui-button-secondary w-full sm:w-auto"
              >
                <Search className="w-4 h-4" />
                Search Quotes
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-1 text-xs text-[var(--color-text-muted)]"
        >
          <Sparkles className="w-3 h-3" />
          Press <kbd className="mx-1">/</kbd> to search
        </motion.p>
      </motion.div>
    </div>
  );
}
