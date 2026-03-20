"use client";

import { motion } from "framer-motion";
import { Compass } from "@phosphor-icons/react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-3.5 text-sm text-[var(--color-text-muted)]"
      >
        <Compass weight="duotone" className="h-4 w-4 animate-spin text-[var(--color-accent-primary)]" />
        Loading...
      </motion.div>
    </div>
  );
}
