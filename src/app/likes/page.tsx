"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkle, ThumbsDown, ArrowLeft } from "@phosphor-icons/react";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";

export default function LikesPage() {
  const { getLikedQuotes, getDislikedQuotes, removeReaction } = useQuotes();
  const liked = getLikedQuotes();
  const disliked = getDislikedQuotes();

  return (
    <main className="relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] lg:px-10 transition-colors duration-300">
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ top: '200px', right: '-200px' }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]">
            <Heart weight="fill" className="h-3 w-3 text-[var(--color-accent-tertiary)]" />
            Saved
          </div>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
            Your collection.
          </h1>
          <p className="mt-3 max-w-xl text-base text-[var(--color-text-secondary)]">
            Every like and dislike is stored in your browser. Nothing leaves your device.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7 transition-colors duration-300"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <Heart weight="fill" className="h-4 w-4 text-[var(--color-accent-tertiary)]" />
              <h2 className="font-display text-xl font-semibold">Liked</h2>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                {liked.length}
              </span>
            </div>
            <div className="space-y-4">
              {liked.length > 0 ? liked.map((reaction) => (
                <QuoteDisplay
                  key={reaction.quoteId}
                  content={reaction.quoteSnapshot.content}
                  author={reaction.quoteSnapshot.author}
                  authorSlug={reaction.quoteSnapshot.authorSlug}
                  tags={reaction.quoteSnapshot.tags}
                  reaction="liked"
                  onReaction={() => removeReaction(reaction.quoteId)}
                />
              )) : (
                <EmptyState icon={Heart} label="No liked quotes yet. Start exploring the archive." />
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7 transition-colors duration-300"
          >
            <div className="mb-5 flex items-center gap-2.5">
              <ThumbsDown className="h-4 w-4 text-[var(--color-text-muted)]" />
              <h2 className="font-display text-xl font-semibold">Passed</h2>
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                {disliked.length}
              </span>
            </div>
            <div className="space-y-4">
              {disliked.length > 0 ? disliked.map((reaction) => (
                <QuoteDisplay
                  key={reaction.quoteId}
                  content={reaction.quoteSnapshot.content}
                  author={reaction.quoteSnapshot.author}
                  authorSlug={reaction.quoteSnapshot.authorSlug}
                  tags={reaction.quoteSnapshot.tags}
                  reaction="disliked"
                  onReaction={() => removeReaction(reaction.quoteId)}
                />
              )) : (
                <EmptyState icon={ThumbsDown} label="No passed quotes yet." />
              )}
            </div>
          </motion.section>
        </div>

        <div className="golden-line mt-10 mb-1" />

        <div className="mt-4 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-4 text-sm transition-colors duration-300">
          <span className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
            <Sparkle weight="duotone" className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
            Stored locally in your browser
          </span>
          <Link href="/search" className="inline-flex items-center gap-1.5 text-[var(--color-accent-primary)] transition-opacity hover:opacity-80">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to archive
          </Link>
        </div>
      </div>
    </main>
  );
}

function EmptyState({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex min-h-[8rem] items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-muted)] transition-colors duration-300">
      <Icon weight="duotone" className="mr-2 h-4 w-4" />
      {label}
    </div>
  );
}
