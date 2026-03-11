"use client";

import React from "react";
import { motion } from "framer-motion";

export function QuoteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card-editorial rounded-sm p-6 md:p-8 overflow-hidden relative"
    >
      <span className="absolute top-4 left-4 text-6xl text-ink-300 dark:text-ink-700 opacity-30">"</span>

      <div className="space-y-3 mb-8 mt-8 relative z-10">
        <div className="h-6 skeleton rounded-sm w-full" />
        <div className="h-6 skeleton rounded-sm w-11/12" />
        <div className="h-6 skeleton rounded-sm w-4/5" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm skeleton" />
          <div className="h-4 w-32 skeleton rounded-sm" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-sm skeleton" />
          <div className="w-10 h-10 rounded-sm skeleton" />
          <div className="w-10 h-10 rounded-sm skeleton" />
        </div>
      </div>

      <div className="mt-6 pt-4 decorative-line flex gap-2">
        <div className="h-5 w-16 skeleton rounded-sm" />
        <div className="h-5 w-20 skeleton rounded-sm" />
        <div className="h-5 w-14 skeleton rounded-sm" />
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
      className="card-editorial rounded-sm p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-sm skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-1/2 skeleton rounded-sm" />
          <div className="h-4 w-1/3 skeleton rounded-sm" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 skeleton rounded-sm w-full" />
        <div className="h-4 skeleton rounded-sm w-5/6" />
        <div className="h-4 skeleton rounded-sm w-4/6" />
      </div>
    </motion.div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-32 skeleton rounded-sm mb-6" />
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
          className="flex flex-col items-center gap-2 p-4 rounded-sm"
        >
          <div className="w-11 h-11 skeleton rounded-sm" />
          <div className="h-3 w-12 skeleton rounded-sm" />
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
      className="card-editorial rounded-sm p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 skeleton rounded-sm" />
        <div className="space-y-2">
          <div className="h-5 w-24 skeleton rounded-sm" />
          <div className="h-3 w-32 skeleton rounded-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-ink-500/10 rounded-sm">
            <div className="w-8 h-8 skeleton rounded-sm mb-3" />
            <div className="h-6 w-10 skeleton rounded-sm mb-1" />
            <div className="h-3 w-14 skeleton rounded-sm" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
