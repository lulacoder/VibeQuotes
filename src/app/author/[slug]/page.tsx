"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Quotes } from "@phosphor-icons/react";
import { getAuthorBySlug, getQuotesByAuthorSlug } from "@/lib/api/quotes";
import { QuoteCard } from "@/components/ui/QuoteCard";

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const author = useMemo(() => getAuthorBySlug(slug), [slug]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getQuotesByAuthorSlug(slug, 1, 50);
      if (mounted) {
        setQuotes(data.results);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <main className="relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] lg:px-10 transition-colors duration-300">
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ top: '50px', right: '-400px' }} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to archive
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-7 sm:p-10 transition-colors duration-300"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-15" />

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                {author?.category || "Author"}
              </p>
              <h1 className="mt-1 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
                {author?.name ?? slug}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
                {author?.bio ?? "An author from the expanded local archive."}
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-5 text-center">
              <p className="text-[0.7rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Quotes</p>
              <p className="mt-1 font-display text-4xl font-semibold text-[var(--color-accent-primary)]">
                {loading ? "—" : quotes.length}
              </p>
            </div>
          </div>
        </motion.header>

        <section className="mt-8 pb-16">
          <div className="golden-line mb-8" />
          <h2 className="mb-5 font-display text-xl font-semibold text-[var(--color-text-primary)]">Collected lines</h2>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shimmer h-28 rounded-2xl" />
              ))}
            </div>
          ) : quotes.length > 0 ? (
            <div className="grid gap-4">
              <AnimatePresence>
                {quotes.map((quote, index) => (
                  <motion.div
                    key={quote._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4) }}
                  >
                    <QuoteCard quote={quote} showFullMeta={true} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center transition-colors duration-300">
              <div>
                <Quotes weight="duotone" className="mx-auto mb-3 h-6 w-6 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-muted)]">No quotes found for this author.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
