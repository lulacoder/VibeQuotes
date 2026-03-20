"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Quotes, Lightning, Sparkle, BookOpenText } from "@phosphor-icons/react";
import { useRandomQuote } from "@/hooks/useQuotes";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteCardSkeleton } from "@/components/ui/Skeleton";
import { getFeaturedQuoteRail } from "@/lib/api/quotes";
import { Compass } from "@phosphor-icons/react";

export default function HomePage() {
  const { data: quote, isLoading, error, refetch, isFetching } = useRandomQuote();
  const { getReaction, addLike, addDislike } = useQuotes();
  const rail = getFeaturedQuoteRail();

  return (
    <main className="noise-overlay relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Background orbs */}
      <div className="teal-orb" style={{ width: 700, height: 700, top: -200, right: -200 }} />
      <div className="teal-orb" style={{ width: 500, height: 500, bottom: -200, left: -150 }} />

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 pb-12 pt-28 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:px-10 lg:pt-32">

        {/* Left copy */}
        <div className="flex flex-col gap-7">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section-eyebrow"
          >
            Offline-first · Browser-stored · Open archive
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display max-w-xl text-[clamp(2.8rem,5.5vw,4.5rem)] font-black leading-[1.02] tracking-[-0.02em]"
          >
            Words that{" "}
            <span className="italic text-[var(--color-accent-primary)]">stay</span>
            <br />
            with you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="max-w-md text-base leading-relaxed text-[var(--color-text-secondary)]"
          >
            A curated archive of wisdom from thinkers, builders, and artists.
            Search by keyword, filter by era, save what resonates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/search" className="btn-primary">
              Explore archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/likes" className="btn-secondary">
              <BookOpenText className="h-4 w-4" />
              Saved quotes
            </Link>
          </motion.div>

          {/* Feature tiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid max-w-md grid-cols-3 gap-2.5 pt-1"
          >
            {[
              { icon: Lightning, label: "Local-first",   desc: "Works offline" },
              { icon: Quotes,    label: "Clean layout",  desc: "No distractions" },
              { icon: Sparkle,   label: "Instant save",  desc: "One tap" },
            ].map((feat) => (
              <div
                key={feat.label}
                className="group rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-4 transition-all duration-200 hover:border-[var(--color-border-hover)]"
              >
                <feat.icon
                  weight="duotone"
                  className="mb-2.5 h-4 w-4 text-[var(--color-accent-primary)] transition-transform duration-300 group-hover:scale-110"
                />
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{feat.label}</p>
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{feat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — quote display */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
          >
            {isLoading ? (
              <QuoteCardSkeleton />
            ) : error || !quote ? (
              <div className="surface flex min-h-[28rem] flex-col items-center justify-center gap-5 p-8 text-center">
                <Compass weight="duotone" className="h-8 w-8 text-[var(--color-text-muted)]" />
                <p className="font-display text-xl font-bold">Couldn&apos;t load a quote.</p>
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

      {/* ── Featured rail ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24 lg:px-10">
        <div className="rule-line mb-8" />

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="section-eyebrow">Featured</span>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-primary)] transition-opacity hover:opacity-75"
          >
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rail.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08 }}
            >
              <QuoteCard
                quote={item}
                featured={index === 0}
                showFullMeta={false}
                animationDelay={0}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
