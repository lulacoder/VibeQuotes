"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Quote, Sparkles, Zap } from "lucide-react";
import { useRandomQuote } from "@/hooks/useQuotes";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteCardSkeleton } from "@/components/ui/Skeleton";
import { getFeaturedQuoteRail } from "@/lib/api/quotes";

export default function HomePage() {
  const { data: quote, isLoading, error, refetch, isFetching } = useRandomQuote();
  const { getReaction, addLike, addDislike } = useQuotes();
  const rail = getFeaturedQuoteRail();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="fixed inset-0 pointer-events-none noise-bg" />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-28">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl"
          >
            A quiet place to read, save, and return.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="max-w-xl text-base text-[var(--color-text-secondary)] sm:text-lg"
          >
            Browse a local quote library with clean filters, fast search, and reactions stored in your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/search" className="ui-button ui-button-primary">
              Explore archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/likes" className="ui-button ui-button-secondary">
              Saved quotes <BookOpen className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-2 text-sm text-[var(--color-text-secondary)] sm:text-[15px]">
            <div className="surface p-4">
              <Zap className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Local data
            </div>
            <div className="surface p-4">
              <Quote className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Quiet layout
            </div>
            <div className="surface p-4">
              <Sparkles className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Fast reactions
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="surface-strong p-4">
            {isLoading ? (
              <QuoteCardSkeleton />
            ) : error || !quote ? (
              <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 rounded-[10px] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] p-8 text-center">
                <p className="text-lg font-semibold">Couldn&apos;t load a quote.</p>
                <button onClick={() => refetch()} className="ui-button ui-button-primary">
                  Try again
                </button>
              </div>
            ) : (
              <QuoteDisplay
                content={quote.content}
                author={quote.author}
                authorSlug={quote.authorSlug}
                tags={quote.tags}
                reaction={getReaction(quote._id)?.type}
                onReaction={(type) => {
                  if (type === "liked") addLike(quote);
                  else addDislike(quote);
                }}
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
              />
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-[var(--color-text-primary)]">Featured quotes</h2>
          <Link href="/search" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            Open search
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {rail.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
            >
              <QuoteCard quote={item} featured={index === 0} showFullMeta={false} animationDelay={0} />
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}
