"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, Search, Sparkles } from "lucide-react";
import { AUTHOR_CATEGORIES, getAllAuthors, searchUnifiedQuotes } from "@/lib/api/quotes";
import type { AuthorCategory, QuoteEra, Quote } from "@/lib/types";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { EraFilter } from "@/components/ui/EraFilter";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { Footer } from "@/components/layout/Footer";

function SearchContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AuthorCategory | null>(null);
  const [selectedEra, setSelectedEra] = useState<QuoteEra | "all">("all");
  const query = searchParams.get("q") ?? "";

  const authors = useMemo(() => getAllAuthors(), []);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const run = async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchUnifiedQuotes(query, selectedEra, selectedCategory ?? undefined, 1, 24);
        setResults(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [query, selectedCategory, selectedEra]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#171321_0%,#09090d_55%,#050507_100%)] px-5 pt-28 text-[var(--color-text-primary)] lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            <Search className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
            Search archive
          </div>
          <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-6xl">Find quotes by word, mood, or author.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            The entire collection is local, indexed, and ready offline. Filter by era and category without waiting on a network call.
          </p>
        </motion.div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-6">
          <SearchBar placeholder="Search quotes or authors..." autoFocus={false} defaultValue={query} />

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <EraFilter selectedEra={selectedEra} onEraSelect={setSelectedEra} />
            <CategoryFilter selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
          <p>{query ? `${results.length} results for “${query}”` : "Start typing to search the archive."}</p>
          <p className="uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{authors.length} authors indexed</p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[rgba(255,99,99,0.2)] bg-[rgba(255,99,99,0.08)] px-4 py-3 text-sm text-[#ffb1b1]">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {loading && <p className="mt-8 text-sm text-[var(--color-text-muted)]">Searching the shelves...</p>}

        {!loading && results.length > 0 && (
          <div className="mt-8 grid gap-4">
            <AnimatePresence>
              {results.map((quote) => (
                <motion.div key={quote._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <QuoteCard quote={quote} showFullMeta={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && query && results.length === 0 && !error && (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 bg-black/20 p-10 text-center">
            <Sparkles className="mx-auto mb-4 h-6 w-6 text-[var(--color-accent-primary)]" />
            <h2 className="text-xl font-bold">No match found</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Try a broader word or remove one of the filters.</p>
          </div>
        )}

        {!query && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {authors.slice(0, 6).map((author) => (
              <Link key={author.slug} href={`/author/${author.slug}`} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition-transform hover:-translate-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">{author.category}</p>
                <h2 className="mt-2 text-lg font-bold">{author.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{author.bio}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SearchContent />
    </Suspense>
  );
}
