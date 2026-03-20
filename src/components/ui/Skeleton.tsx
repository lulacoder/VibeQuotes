"use client";

import React from "react";
import { motion } from "framer-motion";

export function QuoteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-7 sm:p-10"
    >
      <div className="space-y-3 mb-8 mt-4 relative z-10">
        <div className="shimmer h-6 w-full rounded-lg" />
        <div className="shimmer h-6 w-11/12 rounded-lg" />
        <div className="shimmer h-6 w-4/5 rounded-lg" />
      </div>

      <div className="flex items-center justify-between">
        <div className="shimmer h-4 w-32 rounded-lg" />
        <div className="flex gap-2">
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
        </div>
      </div>
    </motion.div>
  );
}

export function QuoteListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <QuoteCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function AuthorCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6"
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="shimmer h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-5 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="shimmer h-3 w-full rounded-lg" />
        <div className="shimmer h-3 w-5/6 rounded-lg" />
      </div>
    </motion.div>
  );
}
