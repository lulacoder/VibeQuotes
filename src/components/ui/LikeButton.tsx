"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ThumbsDown } from "@phosphor-icons/react";

interface LikeButtonProps {
  isLiked: boolean;
  isDisliked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

export function LikeButton({ isLiked, isDisliked, onLike, onDislike }: LikeButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleLike = () => {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 150);
    onLike();
  };

  return (
    <div className="flex shrink-0 items-center gap-1">
      <motion.button
        onClick={handleLike}
        animate={pressed ? { scale: [1, 0.85, 1] } : {}}
        transition={{ duration: 0.15 }}
        aria-label="Like quote"
        className={`icon-btn ${
          isLiked
            ? "border-[color-mix(in_srgb,var(--color-accent-warm)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_10%,transparent)] text-[var(--color-accent-warm)]"
            : ""
        }`}
      >
        <Heart weight={isLiked ? "fill" : "regular"} className="h-3.5 w-3.5" />
      </motion.button>

      <button
        onClick={onDislike}
        aria-label="Dislike quote"
        className={`icon-btn ${
          isDisliked
            ? "border-[color-mix(in_srgb,var(--color-text-muted)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-text-muted)_10%,transparent)] text-[var(--color-text-primary)]"
            : ""
        }`}
      >
        <ThumbsDown weight={isDisliked ? "fill" : "regular"} className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
