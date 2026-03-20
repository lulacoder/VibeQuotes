"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Warning, ArrowClockwise, House } from "@phosphor-icons/react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center sm:p-10 transition-colors duration-300"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-[rgba(212,107,107,0.2)] bg-[rgba(212,107,107,0.06)] text-[var(--color-accent-tertiary)]"
        >
          <Warning weight="duotone" className="h-6 w-6" />
        </motion.div>

        <h1 className="mb-3 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
          Something went wrong
        </h1>

        <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
          Your saved quotes are safe locally. Try refreshing the page.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => reset()} className="btn-primary">
            <ArrowClockwise className="h-4 w-4" />
            Try again
          </button>

          <Link href="/" className="btn-secondary">
            <House className="h-4 w-4" />
            Go home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="mt-6 font-mono text-xs text-[var(--color-text-muted)]">
            {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
