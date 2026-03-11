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

function Particle({ index }: { index: number }) {
  const angle = (index * 360) / 6;
  const distance = 30 + Math.random() * 20;

  return (
    <motion.span
      initial={{
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
      }}
      animate={{
        opacity: 0,
        scale: 0,
        x: Math.cos(angle * Math.PI / 180) * distance,
        y: Math.sin(angle * Math.PI / 180) * distance,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute w-2 h-2 rounded-sm bg-terracotta-500"
      style={{
        left: "50%",
        top: "50%",
        marginLeft: -4,
        marginTop: -4,
      }}
    />
  );
}

export function LikeButton({ isLiked, isDisliked, onLike, onDislike }: LikeButtonProps) {
  const [showParticles, setShowParticles] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }
    onLike();
  };

  return (
    <div className="flex items-center gap-0.5">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleLike}
        className={`relative p-2.5 rounded-sm transition-all duration-300 ${
          isLiked
            ? "bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400"
            : "text-ink-400 hover:text-terracotta-500 hover:bg-terracotta-500/10 dark:text-parchment-500 dark:hover:text-terracotta-400"
        }`}
        aria-label="Like quote"
      >
        <AnimatePresence>
          {showParticles && (
            <>
              {[...Array(6)].map((_, i) => (
                <Particle key={i} index={i} />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div
          animate={isLiked ? {
            scale: [1, 1.3, 0.9, 1.1, 1],
            rotate: [0, -15, 15, -8, 0],
          } : {}}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-300 ${
              isLiked ? "fill-current" : ""
            }`}
          />
        </motion.div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDislike}
        className={`p-2.5 rounded-sm transition-all duration-300 ${
          isDisliked
            ? "bg-ink-500/10 text-ink-500 dark:text-parchment-400"
            : "text-ink-400 hover:text-ink-500 hover:bg-ink-500/10 dark:text-parchment-500 dark:hover:text-parchment-300"
        }`}
        aria-label="Dislike quote"
      >
        <motion.div
          animate={isDisliked ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
        </motion.div>
      </motion.button>
    </div>
  );
}
