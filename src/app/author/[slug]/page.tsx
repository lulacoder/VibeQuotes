"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Quote, Sparkles } from "lucide-react";
import { getAuthorBySlug, getQuotesByAuthorSlug } from "@/lib/api/quotes";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteListSkeleton } from "@/components/ui/Skeleton";
import { Footer } from "@/components/layout/Footer";

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
      const data = await getQuotesByAuthorSlug(slug, 1, 30);
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
    <main className="min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>

        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold sm:text-5xl">{author?.name ?? slug}</h1>
              <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">{author?.bio ?? "An author from the expanded local archive."}</p>
            </div>
            <div className="rounded-[12px] border border-[var(--color-border)] px-5 py-4 text-sm text-[var(--color-text-secondary)]">
              <p className="text-[var(--color-text-muted)]">Quotes</p>
              <p className="mt-1 text-3xl font-semibold text-[var(--color-text-primary)]">{quotes.length}</p>
            </div>
          </div>
        </motion.header>

        <section className="mt-8">
          <h2 className="mb-4 text-base font-medium text-[var(--color-text-primary)]">Collected lines</h2>
          {loading ? (
            <QuoteListSkeleton count={4} />
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {quotes.map((quote) => (
                  <motion.div key={quote._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <QuoteCard quote={quote} showFullMeta={false} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}
