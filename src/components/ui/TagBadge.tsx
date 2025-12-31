"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TagBadgeProps {
  tag: string;
  showLink?: boolean;
}

// Map tags to gradient colors for visual variety
const tagGradients: Record<string, string> = {
  love: "from-pink-500 to-rose-500",
  wisdom: "from-primary-500 to-primary-600",
  life: "from-green-500 to-emerald-500",
  success: "from-amber-500 to-orange-500",
  happiness: "from-yellow-500 to-amber-500",
  motivation: "from-red-500 to-orange-500",
  friendship: "from-purple-500 to-pink-500",
  hope: "from-cyan-500 to-blue-500",
  faith: "from-indigo-500 to-purple-500",
  courage: "from-orange-500 to-red-500",
  default: "from-gray-500 to-gray-600",
};

function getTagGradient(tag: string): string {
  const normalizedTag = tag.toLowerCase();
  return tagGradients[normalizedTag] || tagGradients.default;
}

export function TagBadge({ tag, showLink = true }: TagBadgeProps) {
  const gradient = getTagGradient(tag);

  const content = (
    <motion.span
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium 
        bg-gradient-to-r ${gradient} bg-opacity-10 
        text-gray-700 dark:text-gray-200
        border border-gray-200/50 dark:border-gray-700/50
        hover:border-primary-300 dark:hover:border-primary-700
        hover:shadow-lg hover:shadow-primary-500/10
        transition-all duration-200 cursor-pointer
        backdrop-blur-sm
      `}
    >
      {/* Colored dot indicator */}
      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient}`} />
      {tag}
    </motion.span>
  );

  if (showLink) {
    return (
      <Link href={`/search?tags=${encodeURIComponent(tag)}`}>
        {content}
      </Link>
    );
  }

  return content;
}
