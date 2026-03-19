"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center md:p-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-accent-tertiary)]"
        >
          <AlertTriangle className="h-8 w-8" />
        </motion.div>

        <h1 className="mb-3 text-2xl font-semibold text-[var(--color-text-primary)]">
          Something went wrong!
        </h1>

        <p className="mb-8 text-[var(--color-text-secondary)]">
          We encountered an unexpected error. Don&apos;t worry, your favorites are safe locally.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            onClick={() => reset()}
            className="ui-button ui-button-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>

          <motion.div>
            <Link
              href="/"
              className="ui-button ui-button-secondary"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </motion.div>
        </div>

        {process.env.NODE_ENV === "development" && error.digest && (
          <p className="mt-6 text-xs font-mono text-[var(--color-text-muted)]">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
