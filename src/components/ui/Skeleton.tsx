"use client";

import React from "react";
import { motion } from "framer-motion";

export function QuoteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 md:p-8"
    >
      <div className="space-y-3 mb-8 mt-8 relative z-10">
        <div className="h-5 w-full rounded-md bg-white/8" />
        <div className="h-5 w-11/12 rounded-md bg-white/8" />
        <div className="h-5 w-4/5 rounded-md bg-white/8" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-white/8" />
          <div className="h-4 w-32 rounded-md bg-white/8" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-md bg-white/8" />
          <div className="h-10 w-10 rounded-md bg-white/8" />
          <div className="h-10 w-10 rounded-md bg-white/8" />
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-t border-[var(--color-border)] pt-4">
        <div className="h-4 w-16 rounded-md bg-white/8" />
        <div className="h-4 w-20 rounded-md bg-white/8" />
        <div className="h-4 w-14 rounded-md bg-white/8" />
      </div>
    </motion.div>
  );
}

export function QuoteListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
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
      className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-md bg-white/8" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-1/2 rounded-md bg-white/8" />
          <div className="h-4 w-1/3 rounded-md bg-white/8" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded-md bg-white/8" />
        <div className="h-4 w-5/6 rounded-md bg-white/8" />
        <div className="h-4 w-4/6 rounded-md bg-white/8" />
      </div>
    </motion.div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mb-6 h-4 w-32 rounded-md bg-white/8" />
      <QuoteListSkeleton count={5} />
    </div>
  );
}

export function MoodSelectorSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="flex flex-col items-center gap-2 p-4 rounded-md"
        >
          <div className="h-11 w-11 rounded-md bg-white/8" />
          <div className="h-3 w-12 rounded-md bg-white/8" />
        </motion.div>
      ))}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-md bg-white/8" />
        <div className="space-y-2">
          <div className="h-5 w-24 rounded-md bg-white/8" />
          <div className="h-3 w-32 rounded-md bg-white/8" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-[var(--color-border)] p-4">
            <div className="mb-3 h-8 w-8 rounded-md bg-white/8" />
            <div className="mb-1 h-6 w-10 rounded-md bg-white/8" />
            <div className="h-3 w-14 rounded-md bg-white/8" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
