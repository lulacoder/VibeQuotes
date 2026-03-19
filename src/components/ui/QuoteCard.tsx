"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
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
        "relative overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6",
        featured && "border-[rgba(0,212,170,0.22)]"
      )}
    >
      <p className="mb-5 text-lg font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-xl">“{quote.content}”</p>

      <div className="flex items-center justify-between gap-4">
        <Link href={`/author/${quote.authorSlug}`} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          {quote.author}
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={copyQuote} aria-label="copy quote" className="rounded-md border border-[var(--color-border)] bg-transparent p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            <Copy className="h-4 w-4" />
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
        <div className="mt-5 flex flex-col gap-2 border-t border-[var(--color-border)] pt-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {quote.tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span>{quote.length} characters</span>
        </div>
      )}
    </motion.article>
  );
}
