"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Orbit, Quote, Sparkles, Zap } from "lucide-react";
import { useRandomQuote } from "@/hooks/useQuotes";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";
import { MinimalHeader } from "@/components/ui/MinimalHeader";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteCardSkeleton } from "@/components/ui/Skeleton";
import { getFeaturedQuoteRail } from "@/lib/api/quotes";

export default function HomePage() {
  const { data: quote, isLoading, error, refetch, isFetching } = useRandomQuote();
  const { getReaction, addLike, addDislike } = useQuotes();
  const rail = getFeaturedQuoteRail();

  return (
    <main className="min-h-screen overflow-hidden relative bg-[radial-gradient(circle_at_top,#1b1828_0%,#09090d_48%,#050507_100%)] text-[var(--color-text-primary)]">
      <div className="fixed inset-0 pointer-events-none opacity-35 bg-[linear-gradient(120deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_36%,rgba(0,212,255,0.04)_64%,rgba(255,255,255,0.02)_100%)]" />
      <div className="fixed inset-0 pointer-events-none noise-bg" />

      <MinimalHeader />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-32">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-secondary)]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
            Local archive mode
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[5.6rem]"
          >
            A quote atlas with a sharper pulse.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="max-w-xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg"
          >
            No broken API calls. No empty states pretending to be design. This version pulls from a rich local library and frames each quote like a magazine spread.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-primary)] px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5">
              Explore archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/likes" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-transform hover:-translate-y-0.5 hover:border-[var(--color-accent-primary)]/40">
              Saved quotes <BookOpen className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid max-w-xl grid-cols-3 gap-3 pt-3 text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Zap className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Instant local data
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Quote className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Rich archive text
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Orbit className="mb-3 h-4 w-4 text-[var(--color-accent-primary)]" />
              Designed for flow
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-[var(--color-accent-primary)]/20 blur-3xl" />
          <div className="absolute right-6 top-0 h-36 w-36 rounded-full bg-[var(--color-accent-secondary)]/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            {isLoading ? (
              <QuoteCardSkeleton />
            ) : error || !quote ? (
              <div className="flex min-h-[28rem] flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 p-8 text-center">
                <p className="text-lg font-semibold">Couldn&apos;t load a quote.</p>
                <button onClick={() => refetch()} className="rounded-full bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-semibold text-black">
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
          <h2 className="text-sm uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Featured trail</h2>
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
