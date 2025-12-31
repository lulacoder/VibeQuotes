"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "@/lib/types";
import { useQuotes } from "@/context/QuotesContext";
import { useToast } from "@/context/ToastContext";
import { LikeButton } from "./LikeButton";
import { ShareButton } from "./ShareButton";
import { TagBadge } from "./TagBadge";
import { Quote as QuoteIcon, Copy, Check, Bookmark } from "lucide-react";

interface QuoteCardProps {
  quote: Quote;
  showFullMeta?: boolean;
  animationDelay?: number;
  featured?: boolean;
}

export function QuoteCard({
  quote,
  showFullMeta = true,
  animationDelay = 0,
  featured = false
}: QuoteCardProps) {
  const { addLike, addDislike, getReaction } = useQuotes();
  const { addToast } = useToast();
  const reaction = getReaction(quote._id);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    addLike(quote);
    if (reaction?.type !== "liked") {
      addToast("Added to favorites! ✨", "success");
    }
  };

  const handleDislike = () => {
    addDislike(quote);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
      setCopied(true);
      addToast("Quote copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to copy", "error");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: animationDelay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${featured
          ? "glass-card p-8 md:p-10"
          : "glass-card p-6 md:p-8"
        }`}
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 40px -12px rgba(0,0,0,0.15), 0 0 30px rgba(138, 103, 223, 0.15)"
          : undefined
      }}
    >
      {/* Animated gradient border on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: "linear-gradient(135deg, oklch(58% 0.20 272 / 0.2), oklch(65% 0.16 180 / 0.2))",
          filter: "blur(20px)",
        }}
      />

      {/* Quote Icon with gradient background */}
      <motion.div
        className={`absolute -top-3 left-6 ${featured ? "p-4" : "p-3"} rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 shadow-lg`}
        animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.05 } : {}}
        transition={{ duration: 0.5 }}
      >
        <QuoteIcon className={`${featured ? "w-6 h-6" : "w-5 h-5"} text-white`} />
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 blur-xl opacity-40 -z-10" />
      </motion.div>

      {/* Featured badge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-tertiary-500/20 to-tertiary-400/20 border border-tertiary-500/30"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-500 animate-pulse" />
          <span className="text-xs font-medium text-tertiary-600 dark:text-tertiary-400">Featured</span>
        </motion.div>
      )}

      {/* Quote Content */}
      <blockquote className={`${featured ? "mt-8 mb-8" : "mt-6 mb-6"}`}>
        <p className={`font-serif text-gray-800 dark:text-gray-100 leading-relaxed ${featured
            ? "text-2xl md:text-3xl lg:text-4xl"
            : "text-lg md:text-xl lg:text-2xl"
          }`}>
          <span className="text-primary-500/50 dark:text-primary-400/50">&ldquo;</span>
          {quote.content}
          <span className="text-primary-500/50 dark:text-primary-400/50">&rdquo;</span>
        </p>
      </blockquote>

      {/* Author & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href={`/author/${quote.authorSlug}`}
          className="group/author flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
            {quote.author.charAt(0)}
          </span>
          <span className="relative">
            — {quote.author}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover/author:w-full transition-all duration-300" />
          </span>
        </Link>

        {/* Actions Row */}
        <div className="flex items-center gap-1">
          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className={`p-2 rounded-xl transition-all duration-200 ${copied
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }`}
            aria-label="Copy quote"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <ShareButton quote={quote} />
          <LikeButton
            isLiked={reaction?.type === "liked"}
            isDisliked={reaction?.type === "disliked"}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </div>
      </div>

      {/* Metadata */}
      {showFullMeta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-wrap items-center gap-2">
            {quote.tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <TagBadge tag={tag} />
              </motion.div>
            ))}
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              {quote.length} characters
            </span>
          </div>
        </motion.div>
      )}

      {/* Decorative corner gradient */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-primary-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
    </motion.article>
  );
}
