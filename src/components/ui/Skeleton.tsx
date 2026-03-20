"use client";

import React from "react";
import { motion } from "framer-motion";

export function QuoteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)]"
    >
      {/* Fake teal top bar */}
      <div className="h-[2px] w-full shimmer" />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Quote lines */}
        <div className="flex-1 space-y-2.5">
          <div className="shimmer h-5 w-full rounded-lg" />
          <div className="shimmer h-5 w-10/12 rounded-lg" />
          <div className="shimmer h-5 w-3/4 rounded-lg" />
        </div>

        {/* Author + buttons row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="shimmer h-4 w-28 rounded-lg" />
          <div className="flex gap-1.5">
            <div className="shimmer h-9 w-9 rounded-lg" />
            <div className="shimmer h-9 w-9 rounded-lg" />
            <div className="shimmer h-9 w-9 rounded-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function QuoteListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
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
      className="rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-6"
    >
      <div className="mb-5 flex items-center gap-4">
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
