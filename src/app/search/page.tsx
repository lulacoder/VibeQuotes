"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { WarningCircle, MagnifyingGlass, Sparkle, User, ArrowRight } from "@phosphor-icons/react";
import { AUTHOR_CATEGORIES, getAllAuthors, searchUnifiedQuotes } from "@/lib/api/quotes";
import type { AuthorCategory, QuoteEra, Quote } from "@/lib/types";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { EraFilter } from "@/components/ui/EraFilter";
import { QuoteCard } from "@/components/ui/QuoteCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AuthorCategory | null>(null);
  const [selectedEra, setSelectedEra] = useState<QuoteEra | "all">("all");
  const query = searchParams.get("q") ?? "";

  const authors = useMemo(() => getAllAuthors(), []);
  const filteredAuthors = useMemo(() => {
    if (!selectedCategory) return authors;
    return authors.filter((a) => a.category === selectedCategory);
  }, [authors, selectedCategory]);

  const authorsByCategory = useMemo(() => {
    const grouped: Record<string, typeof authors> = {};
    for (const author of filteredAuthors) {
      if (!grouped[author.category]) grouped[author.category] = [];
      grouped[author.category].push(author);
    }
    return grouped;
  }, [filteredAuthors]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        if (query.trim() || selectedCategory || selectedEra !== "all") {
          const data = await searchUnifiedQuotes(query, selectedEra, selectedCategory ?? undefined, 1, 48);
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query, selectedCategory, selectedEra]);

  const hasActiveFilters = selectedCategory !== null || selectedEra !== "all";
  const showResults = query.trim() || hasActiveFilters;

  return (
    <main className="noise-overlay relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
      <div className="teal-orb" style={{ width: 600, height: 600, top: 0, left: -300 }} />

      <div className="relative z-10 mx-auto max-w-7xl pb-8">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl"
        >
          <p className="section-eyebrow mb-3">Archive</p>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.06] tracking-[-0.02em]">
            Search the archive.
          </h1>
          <p className="mt-3 max-w-lg text-base text-[var(--color-text-secondary)]">
            Every quote is stored locally. Filter by era, category, or search by keyword.
          </p>
        </motion.div>

        {/* Search panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-5 sm:p-7 transition-colors duration-300"
        >
          <SearchBar placeholder="Search quotes, authors, or tags..." defaultValue={query} />

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="section-eyebrow">Era</p>
              <EraFilter selectedEra={selectedEra} onEraSelect={setSelectedEra} />
            </div>
            <div className="space-y-2">
              <p className="section-eyebrow">Category</p>
              <CategoryFilter selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </div>
          </div>
        </motion.div>

        {/* Results bar */}
        <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <p>
            {showResults
              ? loading
                ? "Searching…"
                : `${results.length} quote${results.length !== 1 ? "s" : ""} found`
              : `${filteredAuthors.length} authors in the archive`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => { setSelectedCategory(null); setSelectedEra("all"); }}
              className="font-medium text-[var(--color-accent-primary)] transition-opacity hover:opacity-75"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-accent-warm)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_6%,transparent)] px-4 py-3 text-sm text-[var(--color-accent-warm)]">
            <WarningCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Quote results */}
        {showResults && (
          <div className="mt-6">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="shimmer h-48 rounded-2xl" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.map((quote, index) => (
                    <motion.div
                      key={quote._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: Math.min(index * 0.03, 0.25) }}
                    >
                      <QuoteCard quote={quote} showFullMeta />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-14 text-center">
                <Sparkle weight="duotone" className="mx-auto mb-4 h-6 w-6 text-[var(--color-accent-primary)]" />
                <h2 className="font-display text-xl font-bold">No matches</h2>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Try different keywords or clear your filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Author index */}
        {!showResults && (
          <div className="mt-10 space-y-12 pb-16">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold">Author Archive</h2>
              <span className="rounded-full border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                {filteredAuthors.length}
              </span>
            </div>

            {Object.entries(authorsByCategory).map(([category, catAuthors], catIndex) => {
              const catInfo = AUTHOR_CATEGORIES.find((c) => c.value === category);
              return (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.05 }}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="text-lg">{catInfo?.icon || "📝"}</span>
                    <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                      {catInfo?.label || category}
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">{catAuthors.length}</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {catAuthors.map((author, index) => (
                      <motion.div
                        key={author.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025 }}
                      >
                        <Link
                          href={`/author/${author.slug}`}
                          className="group block rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-5 transition-all duration-250 card-hover"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                                <p className="section-eyebrow">{author.category}</p>
                              </div>
                              <h4 className="mt-2 font-display text-lg font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-primary)]">
                                {author.name}
                              </h4>
                              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                                {author.bio}
                              </p>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-muted)] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-primary)]" />}>
      <SearchContent />
    </Suspense>
  );
}
