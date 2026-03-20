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

export function QuoteCard({ quote, showFullMeta = true, animationDelay = 0, featured = false }: QuoteCardProps) {
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
        "group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--color-border-hover)]",
        featured && "border-[rgba(212,165,74,0.18)]"
      )}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-25" />
      )}

      <p className="quote-text mb-5 text-lg leading-relaxed text-[var(--color-text-primary)] sm:text-xl">
        &ldquo;{quote.content}&rdquo;
      </p>

      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/author/${quote.authorSlug}`}
          className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
        >
          {quote.author}
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copyQuote}
            aria-label="copy quote"
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

      {showFullMeta && quote.tags.length > 0 && (
        <div className="mt-5 border-t border-[var(--color-border)] pt-4">
          <div className="flex flex-wrap items-center gap-2">
            {quote.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
            <span className="ml-auto text-xs text-[var(--color-text-muted)]">{quote.length} chars</span>
          </div>
        </div>
      )}
    </motion.article>
  );
}
