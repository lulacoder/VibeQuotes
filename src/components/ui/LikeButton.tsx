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

// Particle component for burst effect
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
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-tertiary-400 to-tertiary-500"
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
    <div className="flex items-center gap-1">
      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleLike}
        className={`relative p-2.5 rounded-xl transition-all duration-300 ${isLiked
            ? "bg-gradient-to-br from-tertiary-500/20 to-tertiary-400/20 text-tertiary-500"
            : "text-gray-400 hover:text-tertiary-500 hover:bg-tertiary-500/10"
          }`}
        aria-label="Like quote"
      >
        {/* Particles */}
        <AnimatePresence>
          {showParticles && (
            <>
              {[...Array(6)].map((_, i) => (
                <Particle key={i} index={i} />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Heart Icon */}
        <motion.div
          animate={isLiked ? {
            scale: [1, 1.3, 0.9, 1.1, 1],
            rotate: [0, -15, 15, -8, 0],
          } : {}}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${isLiked ? "fill-current drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : ""
              }`}
          />
        </motion.div>

        {/* Ripple effect */}
        <AnimatePresence>
          {isLiked && (
            <motion.span
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-xl bg-tertiary-500"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dislike Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDislike}
        className={`p-2.5 rounded-xl transition-all duration-300 ${isDisliked
            ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        aria-label="Dislike quote"
      >
        <motion.div
          animate={isDisliked ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ThumbsDown className={`w-5 h-5 ${isDisliked ? "fill-current" : ""}`} />
        </motion.div>
      </motion.button>
    </div>
  );
}
