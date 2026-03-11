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
      className="card-editorial rounded-sm p-5"
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
              <div className="inline-flex p-2 rounded-sm bg-terracotta-500/10 mb-2">
                <Icon className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400" />
              </div>
              <div
                className={`font-serif font-bold text-ink-900 dark:text-parchment-100 ${
                  stat.isText ? "text-xs truncate" : "text-xl"
                }`}
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-ink-500 dark:text-parchment-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
