"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Copy } from "@phosphor-icons/react";
import { useQuotes } from "@/context/QuotesContext";
import { useToast } from "@/context/ToastContext";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { ShareButton } from "./ShareButton";
import { LikeButton } from "./LikeButton";

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
  featured = false,
}: QuoteCardProps) {
  const { addLike, addDislike, getReaction } = useQuotes();
  const { addToast } = useToast();
  const reaction = getReaction(quote._id);

  const copyQuote = async () => {
    await navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`);
    addToast("Copied to clipboard", "success");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-bg-secondary)] transition-all duration-300 card-hover",
        featured
          ? "border-[color-mix(in_srgb,var(--color-accent-primary)_30%,transparent)]"
          : "border-[var(--color-border-hard)]"
      )}
    >
      {/* Teal top rule on featured */}
      {featured && (
        <div className="h-[2px] w-full bg-[var(--color-accent-primary)]" />
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Quote content */}
        <p className="quote-text mb-5 flex-1 text-[1.1rem] leading-snug text-[var(--color-text-primary)] sm:text-[1.2rem]">
          &ldquo;{quote.content}&rdquo;
        </p>

        {/* Author row + actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href={`/author/${quote.authorSlug}`}
            className="group/author flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
          >
            <span className="h-px w-4 bg-[var(--color-accent-primary)] opacity-60 transition-all duration-300 group-hover/author:w-6 group-hover/author:opacity-100" />
            <span className="font-medium">{quote.author}</span>
          </Link>

          {/* Action buttons — always visible, never overflow */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={copyQuote}
              aria-label="Copy quote"
              className="icon-btn"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <ShareButton quote={quote} />
            <LikeButton
              isLiked={reaction?.type === "liked"}
              isDisliked={reaction?.type === "disliked"}
              onLike={() => addLike(quote)}
              onDislike={() => addDislike(quote)}
            />
          </div>
        </div>

        {/* Tags row */}
        {showFullMeta && quote.tags.length > 0 && (
          <div className="mt-4 border-t border-[var(--color-border-hard)] pt-3.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {quote.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
              <span className="ml-auto font-mono text-[10px] text-[var(--color-text-muted)]">
                {quote.length}c
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}
