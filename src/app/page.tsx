"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Quotes, Sparkle, Lightning, Compass } from "@phosphor-icons/react";
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
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ top: '-200px', right: '-100px' }} />
      <div className="ambient-glow" style={{ bottom: '-300px', left: '-200px', background: 'radial-gradient(circle, rgba(201,135,92,0.05) 0%, transparent 70%)' }} />

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-28 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pt-32">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            Offline-first quote archive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display max-w-2xl text-[clamp(2.5rem,5.5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.03em]"
          >
            Words that stay
            <br />
            <span className="text-[var(--color-accent-primary)]">with you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)]"
          >
            A curated collection of quotes from thinkers, builders, and artists.
            Search by word, filter by era, save what resonates — all stored in your browser.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/search" className="btn-primary">
              Explore the archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/likes" className="btn-secondary">
              <BookOpenText className="h-4 w-4" />
              Saved quotes
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid max-w-lg grid-cols-3 gap-2.5 pt-2"
          >
            {[
              { icon: Lightning, label: "Local data", desc: "Works offline" },
              { icon: Quotes, label: "Clean layout", desc: "No clutter" },
              { icon: Sparkle, label: "Fast reactions", desc: "Save instantly" },
            ].map((feat) => (
              <div key={feat.label} className="surface p-4 group">
                <feat.icon weight="duotone" className="mb-2.5 h-4 w-4 text-[var(--color-accent-primary)] transition-transform duration-300 group-hover:scale-110" />
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{feat.label}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{feat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLoading ? (
              <QuoteCardSkeleton />
            ) : error || !quote ? (
              <div className="surface flex min-h-[28rem] flex-col items-center justify-center gap-4 p-8 text-center">
                <Compass weight="duotone" className="h-8 w-8 text-[var(--color-text-muted)]" />
                <p className="font-display text-xl font-semibold">Couldn&apos;t find a quote.</p>
                <button onClick={() => refetch()} className="btn-primary">
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
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        <div className="golden-line mb-8" />
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">Featured</h2>
          <Link href="/search" className="text-sm text-[var(--color-accent-primary)] transition-opacity hover:opacity-80">
            Browse all &rarr;
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rail.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
            >
              <QuoteCard quote={item} featured={index === 0} showFullMeta={false} animationDelay={0} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
