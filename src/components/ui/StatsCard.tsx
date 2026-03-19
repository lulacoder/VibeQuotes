"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Tag, Award } from "lucide-react";
import { useQuotes } from "@/context/QuotesContext";

export function StatsCard() {
  const { getLikedQuotes, likedCount } = useQuotes();
  const likedQuotes = getLikedQuotes();

  const uniqueAuthors = new Set(likedQuotes.map((r) => r.quoteSnapshot.author)).size;
  const allTags = likedQuotes.flatMap((r) => r.quoteSnapshot.tags);
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const favoriteTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const stats = [
    { label: "Saved", value: likedCount, icon: Heart },
    { label: "Authors", value: uniqueAuthors, icon: Users },
    { label: "Top Tag", value: favoriteTag, icon: Tag, isText: true },
    {
      label: "Level",
      value: likedCount >= 50 ? "Master" : likedCount >= 20 ? "Pro" : likedCount >= 5 ? "Explorer" : "New",
      icon: Award,
      isText: true,
    },
  ];

  if (likedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5"
    >
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="text-center"
            >
              <div className="mb-2 inline-flex rounded-md border border-[var(--color-border)] p-2 text-[var(--color-accent-primary)]">
                <Icon className="w-4 h-4" />
              </div>
              <div
                className={`font-semibold text-[var(--color-text-primary)] ${
                  stat.isText ? "text-xs truncate" : "text-xl"
                }`}
              >
                {stat.value}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
