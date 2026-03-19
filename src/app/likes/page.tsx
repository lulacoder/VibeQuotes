"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { useQuotes } from "@/context/QuotesContext";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";
import { Footer } from "@/components/layout/Footer";

export default function LikesPage() {
  const { getLikedQuotes, getDislikedQuotes, removeReaction } = useQuotes();
  const liked = getLikedQuotes();
  const disliked = getDislikedQuotes();

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
            <Heart className="h-3.5 w-3.5 text-[var(--color-accent-tertiary)]" />
            Saved
          </div>
          <h1 className="text-4xl font-semibold sm:text-5xl">Your marked quotes, kept locally.</h1>
          <p className="mt-4 max-w-2xl text-base text-[var(--color-text-secondary)]">Likes and dislikes live in your browser.</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7">
            <h2 className="mb-5 text-base font-medium">Liked</h2>
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
                <EmptyState label="No liked quotes yet." />
              )}
            </div>
          </section>

          <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-7">
            <h2 className="mb-5 text-base font-medium">Disliked</h2>
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
                <EmptyState label="No disliked quotes yet." />
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-4 text-sm text-[var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--color-accent-primary)]" /> Saved locally</span>
          <Link href="/" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)]">Back home</Link>
        </div>
      </div>

    </main>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[10rem] items-center justify-center rounded-[12px] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] text-sm text-[var(--color-text-muted)]">
      <Trash2 className="mr-2 h-4 w-4" />
      {label}
    </div>
  );
}
