"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface TagBadgeProps {
  tag: string;
  showLink?: boolean;
}

export function TagBadge({ tag, showLink = true }: TagBadgeProps) {
  const content = (
    <motion.span
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      className="tag-chip cursor-pointer transition-colors hover:border-[rgba(212,165,74,0.2)] hover:text-[var(--color-text-secondary)]"
    >
      {tag}
    </motion.span>
  );

  if (showLink) {
    return (
      <Link href={`/search?q=${encodeURIComponent(tag)}`}>
        {content}
      </Link>
    );
  }

  return content;
}
