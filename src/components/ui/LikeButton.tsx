"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ThumbsDown } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  isDisliked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

export function LikeButton({ isLiked, isDisliked, onLike, onDislike }: LikeButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleLike = () => {
    setIsPressed(true);
    window.setTimeout(() => setIsPressed(false), 150);
    onLike();
  };

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        onClick={handleLike}
        className={`relative rounded-md border p-2.5 transition-colors ${
          isLiked
            ? "border-[rgba(255,107,157,0.35)] bg-[rgba(255,107,157,0.1)] text-[var(--color-accent-tertiary)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`}
        aria-label="Add to favorites"
      >
        <motion.div
          animate={isPressed ? { scale: [1, 0.92, 1] } : {}}
          transition={{ duration: 0.15 }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </motion.div>
      </motion.button>

      <motion.button
        onClick={onDislike}
        className={`rounded-md border p-2.5 transition-colors ${
          isDisliked
            ? "border-[var(--color-border)] bg-white/5 text-[var(--color-text-primary)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        }`}
        aria-label="Dislike quote"
      >
        <ThumbsDown className={`h-4 w-4 ${isDisliked ? "fill-current" : ""}`} />
      </motion.button>
    </div>
  );
}
