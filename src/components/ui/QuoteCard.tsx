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
        "relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl",
        featured && "border-[rgba(0,212,255,0.22)] bg-[rgba(0,212,255,0.05)]"
      )}
    >
      <p className="mb-5 text-xl font-semibold leading-relaxed text-[var(--color-text-primary)] sm:text-2xl">“{quote.content}”</p>

      <div className="flex items-center justify-between gap-4">
        <Link href={`/author/${quote.authorSlug}`} className="text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          {quote.author}
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={copyQuote} aria-label="copy quote" className="rounded-full border border-white/10 bg-white/5 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
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
        <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          {quote.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1">{tag}</span>
          ))}
          <span className="ml-auto">{quote.length} characters</span>
        </div>
      )}
    </motion.article>
  );
}
