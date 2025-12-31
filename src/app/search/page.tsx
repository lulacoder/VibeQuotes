"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, PaginatedQuotes } from "@/lib/types";
import { searchQuotes, POPULAR_AUTHORS } from "@/lib/api/quotable";
import { SearchBar } from "@/components/ui/SearchBar";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { Pagination } from "@/components/ui/Pagination";
import { QuoteListSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  AlertCircle,
  Users,
  Sparkles,
  Tag,
  Lightbulb,
  BookOpen,
  X
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const author = searchParams.get("author") || "";
  const tags = searchParams.get("tags") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [results, setResults] = useState<PaginatedQuotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSearch = query || author || tags;

  useEffect(() => {
    if (!hasSearch) {
      setResults(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchQuotes({
          query: query || undefined,
          author: author || undefined,
          tags: tags || undefined,
          page,
          limit: 10,
        });
        setResults(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, author, tags, page, hasSearch]);

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30"
          >
            <Search className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Search Quotes</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Find wisdom from thousands of quotes by great minds
          </p>

          <SearchBar autoFocus={!hasSearch} />
        </motion.div>

        {/* Active Filters */}
        {hasSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">Filters:</span>
            {query && (
              <Link
                href={`/search?${new URLSearchParams(
                  Object.fromEntries(
                    Object.entries({ author, tags }).filter(([, v]) => v)
                  )
                )}`}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 glass-subtle rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <Search className="w-3 h-3" />
                &quot;{query}&quot;
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            {author && (
              <Link
                href={`/search?${new URLSearchParams(
                  Object.fromEntries(
                    Object.entries({ q: query, tags }).filter(([, v]) => v)
                  )
                )}`}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 glass-subtle rounded-full text-sm font-medium text-accent-700 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors"
              >
                <Users className="w-3 h-3" />
                {author}
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            {tags && (
              <Link
                href={`/search?${new URLSearchParams(
                  Object.fromEntries(
                    Object.entries({ q: query, author }).filter(([, v]) => v)
                  )
                )}`}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 glass-subtle rounded-full text-sm font-medium text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tags}
                <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="glass-card rounded-3xl p-8 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && <QuoteListSkeleton count={5} />}

        {/* Results */}
        {!loading && results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Found <span className="font-semibold text-gray-700 dark:text-gray-300">{results.totalCount}</span> quote{results.totalCount !== 1 ? "s" : ""}
                {results.totalPages > 1 && (
                  <span className="ml-1">
                    · Page {results.page} of {results.totalPages}
                  </span>
                )}
              </p>
            </div>

            {/* Quote List */}
            {results.results.length > 0 ? (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {results.results.map((quote, index) => (
                    <QuoteCard
                      key={quote._id}
                      quote={quote}
                      animationDelay={index * 0.05}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <NoResultsState query={query} author={author} />
            )}

            {/* Pagination */}
            {results.totalPages > 1 && (
              <Pagination
                currentPage={results.page}
                totalPages={results.totalPages}
                baseUrl="/search"
              />
            )}
          </motion.div>
        )}

        {/* Empty State - No Search Yet */}
        {!hasSearch && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            {/* Popular Authors */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                  <Users className="w-4 h-4 text-white" />
                </div>
                Popular Authors
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POPULAR_AUTHORS.map((author, index) => (
                  <motion.div
                    key={author.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/author/${author.slug}`}
                      className="block p-4 glass-card rounded-2xl hover:shadow-lg hover:shadow-primary-500/10 transition-all text-center group"
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-lg font-bold text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        {author.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {author.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Search Tips */}
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-500 to-primary-500">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                Search Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Search, tip: 'Search by keyword: try "success", "love", or "wisdom"' },
                  { icon: Users, tip: 'Search by author: try "Einstein" or "Mark Twain"' },
                  { icon: BookOpen, tip: "Use the author page to see all quotes from a specific author" },
                  { icon: Tag, tip: "Click on tags to find related quotes" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50"
                  >
                    <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <item.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function NoResultsState({ query, author }: { query: string; author: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="glass-card rounded-3xl p-8 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          No quotes found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {author
            ? `We couldn't find any quotes from "${author}". This author may not be in our database yet.`
            : `We couldn't find any quotes matching "${query}". Try different keywords.`}
        </p>

        {/* Suggested Authors */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Try these popular authors instead:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_AUTHORS.slice(0, 4).map((author) => (
              <Link
                key={author.slug}
                href={`/author/${author.slug}`}
                className="px-4 py-2 glass-subtle rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md transition-all"
              >
                {author.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<QuoteListSkeleton count={5} />}>
      <SearchContent />
    </Suspense>
  );
}
