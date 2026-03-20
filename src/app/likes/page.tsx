"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkle, ThumbsDown, ArrowRight } from "@phosphor-icons/react";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";

export default function LikesPage() {
  const { getLikedQuotes, getDislikedQuotes, removeReaction } = useQuotes();
  const liked    = getLikedQuotes();
  const disliked = getDislikedQuotes();

  return (
    <main className="noise-overlay relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
      <div className="teal-orb" style={{ width: 600, height: 600, top: 100, right: -200 }} />

      <div className="relative z-10 mx-auto max-w-6xl pb-16">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl"
        >
          <p className="section-eyebrow mb-3">Your collection</p>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.06] tracking-[-0.02em]">
            Saved quotes.
          </h1>
          <p className="mt-3 max-w-lg text-base text-[var(--color-text-secondary)]">
            Every like and dislike is stored in your browser. Nothing leaves your device.
          </p>
        </motion.div>

        {/* Stats pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-3"
        >
          <span className="flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-accent-warm)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_8%,transparent)] px-4 py-1.5 text-sm font-medium text-[var(--color-accent-warm)]">
            <Heart weight="fill" className="h-3.5 w-3.5" />
            {liked.length} liked
          </span>
          <span className="flex items-center gap-2 rounded-full border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--color-text-muted)]">
            <ThumbsDown className="h-3.5 w-3.5" />
            {disliked.length} passed
          </span>
        </motion.div>

        {/* Two-column panels */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Liked */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--color-accent-warm)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_6%,transparent)] px-4 py-3">
              <Heart weight="fill" className="h-4 w-4 text-[var(--color-accent-warm)]" />
              <h2 className="font-display text-lg font-bold">Liked</h2>
              <span className="ml-auto font-mono text-xs text-[var(--color-text-muted)]">{liked.length}</span>
            </div>

            <AnimatePresence>
              {liked.length > 0 ? (
                liked.map((reaction, i) => (
                  <motion.div
                    key={reaction.quoteId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <QuoteDisplay
                      content={reaction.quoteSnapshot.content}
                      author={reaction.quoteSnapshot.author}
                      authorSlug={reaction.quoteSnapshot.authorSlug}
                      tags={reaction.quoteSnapshot.tags}
                      reaction="liked"
                      onReaction={() => removeReaction(reaction.quoteId)}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptyState icon={Heart} label="No liked quotes yet. Start exploring the archive." />
              )}
            </AnimatePresence>
          </motion.section>

          {/* Passed */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] px-4 py-3">
              <ThumbsDown className="h-4 w-4 text-[var(--color-text-muted)]" />
              <h2 className="font-display text-lg font-bold">Passed</h2>
              <span className="ml-auto font-mono text-xs text-[var(--color-text-muted)]">{disliked.length}</span>
            </div>

            <AnimatePresence>
              {disliked.length > 0 ? (
                disliked.map((reaction, i) => (
                  <motion.div
                    key={reaction.quoteId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <QuoteDisplay
                      content={reaction.quoteSnapshot.content}
                      author={reaction.quoteSnapshot.author}
                      authorSlug={reaction.quoteSnapshot.authorSlug}
                      tags={reaction.quoteSnapshot.tags}
                      reaction="disliked"
                      onReaction={() => removeReaction(reaction.quoteId)}
                    />
                  </motion.div>
                ))
              ) : (
                <EmptyState icon={ThumbsDown} label="No passed quotes yet." />
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Footer bar */}
        <div className="mt-10 rule-line" />
        <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] px-5 py-4 text-sm transition-colors duration-300">
          <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Sparkle weight="duotone" className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
            Stored locally in your browser
          </span>
          <Link
            href="/search"
            className="flex items-center gap-1.5 font-medium text-[var(--color-accent-primary)] transition-opacity hover:opacity-75"
          >
            Browse archive <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex min-h-[10rem] items-center justify-center rounded-xl border border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-muted)] transition-colors duration-300">
      <Icon weight="duotone" className="mr-2.5 h-4 w-4 shrink-0" />
      {label}
    </div>
  );
}
