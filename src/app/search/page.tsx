"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, PaginatedQuotes, AuthorCategory, QuoteEra } from "@/lib/types";
import { searchUnifiedQuotes, getAllModernAuthors } from "@/lib/api/quotes";
import { POPULAR_AUTHORS } from "@/lib/api/quotable";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { EraFilter } from "@/components/ui/EraFilter";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteListSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import {
  Search,
  AlertCircle,
  Users,
  Sparkles,
  Tag,
  ChevronDown,
  RefreshCw
} from "lucide-react";

const RESULTS_PER_PAGE = 10;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Quote[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AuthorCategory | null>(null);
  const [selectedEra, setSelectedEra] = useState<QuoteEra | "all">("all");
  const [hasMore, setHasMore] = useState(true);

  const modernAuthors = getAllModernAuthors();
  const hasSearch = query.length > 0;

  const searchQuotes = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!hasSearch) return;

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const data = await searchUnifiedQuotes(
        query,
        selectedEra,
        selectedCategory || undefined,
        page,
        RESULTS_PER_PAGE
      );

      if (append) {
        setResults((prev) => {
          const combined = [...prev, ...data.results];
          const unique = combined.filter((q, idx, arr) => arr.findIndex((x) => x._id === q._id) === idx);
          return unique;
        });
      } else {
        setResults(data.results);
        setTotalCount(data.totalCount);
      }

      setCurrentPage(page);
      setHasMore(page < data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, selectedEra, selectedCategory, hasSearch]);

  useEffect(() => {
    if (hasSearch) {
      setResults([]);
      setCurrentPage(1);
      searchQuotes(1, false);
    }
  }, [query, selectedCategory, selectedEra]);

  const handleLoadMore = () => {
    searchQuotes(currentPage + 1, true);
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20"
          >
            <Search className="w-6 h-6 text-white" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="gradient-text">Search Quotes</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Find wisdom from entrepreneurs, philosophers, and great minds
          </p>

          <SearchBar autoFocus={!hasSearch} />

          {(hasSearch || !loading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 space-y-3"
            >
              <EraFilter selectedEra={selectedEra} onEraSelect={setSelectedEra} />
              <CategoryFilter selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
            </motion.div>
          )}
        </motion.div>

        {hasSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Searching..." : `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${query}"`}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
          </motion.div>
        )}

        {loading && <QuoteListSkeleton count={3} />}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {results.map((quote, index) => (
                <motion.div
                  key={quote._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <QuoteCard quote={quote} showFullMeta={false} />
                </motion.div>
              ))}
            </AnimatePresence>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Load More
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </div>
        )}

        {!loading && hasSearch && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No quotes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Try different keywords or adjust your filters
            </p>
          </motion.div>
        )}

        {!hasSearch && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Modern Voices
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400">
                  New
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {modernAuthors.slice(0, 6).map((author, index) => (
                  <motion.div
                    key={author.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/author/${author.slug}`}
                      className="block p-3 glass-card rounded-xl hover:shadow-md transition-all text-center group"
                    >
                      <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        {author.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block truncate">
                        {author.name}
                      </span>
                      <span className="text-[10px] text-gray-400 capitalize">{author.category}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Classic Authors
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POPULAR_AUTHORS.slice(0, 4).map((author, index) => (
                  <motion.div
                    key={author.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={`/author/${author.slug}`}
                      className="block p-3 glass-card rounded-xl hover:shadow-md transition-all text-center group"
                    >
                      <div className="w-9 h-9 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-400/20 to-gray-500/20 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform">
                        {author.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block truncate">
                        {author.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 glass-card rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-500" />
                Search Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                <p>• Search by keyword: "success", "love", "wisdom"</p>
                <p>• Search by author: "Hormozi", "Musk", "Naval"</p>
                <p>• Use filters to narrow by era or category</p>
                <p>• Click tags on quotes to find similar ones</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<QuoteListSkeleton count={3} />}>
      <SearchContent />
    </Suspense>
  );
}
