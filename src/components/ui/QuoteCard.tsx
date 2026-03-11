"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "@/lib/types";
import { useQuotes } from "@/context/QuotesContext";
import { useToast } from "@/context/ToastContext";
import { LikeButton } from "./LikeButton";
import { ShareButton } from "./ShareButton";
import { Copy, Check, Sparkles, ArrowRight } from "lucide-react";

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
      addToast("Saved to favorites!", "success");
    }
  };

  const handleDislike = () => {
    addDislike(quote);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
      setCopied(true);
      addToast("Copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to copy", "error");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay: animationDelay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative transition-all duration-300 ${
        featured ? "card-editorial p-8" : "card-editorial p-6"
      }`}
    >
      <span className="quote-mark-decoration">{'"'}</span>

      {quote.era === "modern" && !featured && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-sm tag-badge"
        >
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-medium">Modern</span>
        </motion.div>
      )}

      <blockquote className={`${featured ? "mt-6 mb-6" : "mt-4 mb-5"} relative z-10`}>
        <p className={`font-serif italic ${
          featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
        } leading-relaxed text-ink-900 dark:text-parchment-100`}>
          {quote.content}
        </p>
      </blockquote>

      <div className="flex items-center justify-between gap-4 relative z-10">
        <Link
          href={`/author/${quote.authorSlug}`}
          className="flex items-center gap-3 group/author"
        >
          <span className="w-10 h-10 rounded-sm bg-gradient-to-br from-terracotta-500/20 to-brass/20 flex items-center justify-center text-sm font-serif font-bold text-terracotta-600 dark:text-terracotta-400 group-hover/author:scale-105 transition-transform">
            {quote.author.charAt(0)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink-700 dark:text-parchment-200 group-hover/author:text-terracotta-600 dark:group-hover/author:text-terracotta-400 transition-colors">
              {quote.author}
            </span>
            <span className="text-xs text-ink-500 dark:text-parchment-500 flex items-center gap-1 opacity-0 group-hover/author:opacity-100 transition-opacity">
              View profile <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`p-2.5 rounded-sm transition-all ${
              copied
                ? "bg-sage-500/20 text-sage-600 dark:text-sage-400"
                : "text-ink-400 hover:text-ink-600 hover:bg-parchment-200 dark:hover:bg-ink-100 dark:text-parchment-500 dark:hover:text-parchment-300"
            }`}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="w-4 h-4" />
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

      {showFullMeta && quote.tags.length > 0 && (
        <div className="mt-5 pt-4 decorative-line flex flex-wrap items-center gap-2">
          {quote.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
          <span className="text-[10px] text-ink-400 dark:text-parchment-500 ml-auto tracking-wider">
            {quote.content.length} characters
          </span>
        </div>
      )}
    </motion.article>
  );
}
