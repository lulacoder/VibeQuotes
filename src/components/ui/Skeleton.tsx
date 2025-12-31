"use client";

import React from "react";
import { motion } from "framer-motion";

export function QuoteCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card rounded-3xl p-6 md:p-8 overflow-hidden"
    >
      {/* Quote Icon Skeleton */}
      <div className="w-12 h-12 rounded-2xl skeleton -mt-9 mb-6" />

      {/* Quote Content */}
      <div className="space-y-3 mb-8">
        <div className="h-6 skeleton rounded-lg w-full" />
        <div className="h-6 skeleton rounded-lg w-11/12" />
        <div className="h-6 skeleton rounded-lg w-4/5" />
      </div>

      {/* Author & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full skeleton" />
          <div className="h-4 w-32 skeleton rounded" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl skeleton" />
          <div className="w-10 h-10 rounded-xl skeleton" />
          <div className="w-10 h-10 rounded-xl skeleton" />
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6 pt-6 border-t border-gray-200/30 dark:border-gray-700/30 flex gap-2">
        <div className="h-6 w-16 skeleton rounded-full" />
        <div className="h-6 w-20 skeleton rounded-full" />
        <div className="h-6 w-14 skeleton rounded-full" />
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-wave" />
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
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-1/2 skeleton rounded" />
          <div className="h-4 w-1/3 skeleton rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-5/6" />
        <div className="h-4 skeleton rounded w-4/6" />
      </div>
    </motion.div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Results count skeleton */}
      <div className="h-4 w-32 skeleton rounded mb-6" />

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
          className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-subtle"
        >
          <div className="w-11 h-11 rounded-xl skeleton" />
          <div className="h-3 w-12 skeleton rounded" />
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
      className="glass-card rounded-3xl p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl skeleton" />
        <div className="space-y-2">
          <div className="h-5 w-24 skeleton rounded" />
          <div className="h-3 w-32 skeleton rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl glass-subtle">
            <div className="w-8 h-8 rounded-lg skeleton mb-3" />
            <div className="h-6 w-10 skeleton rounded mb-1" />
            <div className="h-3 w-14 skeleton rounded" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
