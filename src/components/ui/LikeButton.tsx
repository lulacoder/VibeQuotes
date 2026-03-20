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
  const [isPressed, setIsPressed] = useState(false);

  const handleLike = () => {
    setIsPressed(true);
    window.setTimeout(() => setIsPressed(false), 150);
    onLike();
  };

  return (
    <div className="flex items-center gap-1">
      <motion.button
        onClick={handleLike}
        className={`icon-btn ${
          isLiked
            ? "border-[rgba(212,107,107,0.3)] bg-[rgba(212,107,107,0.08)] text-[var(--color-accent-tertiary)]"
            : ""
        }`}
        aria-label="Add to favorites"
      >
        <motion.div
          animate={isPressed ? { scale: [1, 0.88, 1] } : {}}
          transition={{ duration: 0.15 }}
        >
          <Heart weight={isLiked ? "fill" : "regular"} className="h-3.5 w-3.5" />
        </motion.div>
      </motion.button>

      <motion.button
        onClick={onDislike}
        className={`icon-btn ${isDisliked ? "bg-white/5 text-[var(--color-text-primary)]" : ""}`}
        aria-label="Dislike quote"
      >
        <ThumbsDown weight={isDisliked ? "fill" : "regular"} className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}
