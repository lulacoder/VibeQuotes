"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-4 text-sm text-[var(--color-text-secondary)]">
        Loading...
      </motion.div>
    </div>
  );
}
