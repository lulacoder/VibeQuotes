"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Quote, Author, PaginatedQuotes, AuthorCategory } from "@/lib/types";
import { getAuthor, POPULAR_AUTHORS } from "@/lib/api/quotable";
import { getQuotesByAuthorSlug, getAllModernAuthors, MODERN_AUTHORS } from "@/lib/api/quotes";
import { getQuotesByAuthor as getLocalQuotesByAuthor } from "@/data/modern-quotes";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { AuthorCardSkeleton, QuoteListSkeleton } from "@/components/ui/Skeleton";
import {
  User,
  ArrowLeft,
  Users,
  ChevronDown,
  RefreshCw,
  Quote as QuoteIcon,
  Sparkles
} from "lucide-react";

const QUOTES_PER_LOAD = 10;

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isModernAuthor, setIsModernAuthor] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      setQuotes([]);
      setCurrentPage(1);

      const modernAuthor = MODERN_AUTHORS[slug as keyof typeof MODERN_AUTHORS];

      if (modernAuthor) {
        setIsModernAuthor(true);
        setAuthor({
          _id: slug,
          name: modernAuthor.name,
          slug: modernAuthor.slug,
          bio: modernAuthor.bio,
          description: modernAuthor.category.charAt(0).toUpperCase() + modernAuthor.category.slice(1),
          link: "",
          quoteCount: getLocalQuotesByAuthor(slug).length,
        });

        const localQuotes = getLocalQuotesByAuthor(slug);
        const mappedQuotes: Quote[] = localQuotes.map((mq) => ({
          _id: mq.id,
          content: mq.content,
          author: mq.author,
          authorSlug: mq.authorSlug,
          length: mq.content.length,
          tags: mq.tags,
          source: "local" as const,
          era: "modern" as const,
          category: mq.category,
        }));

        setQuotes(mappedQuotes);
        setTotalCount(mappedQuotes.length);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setIsModernAuthor(false);

      try {
        const data = await getAuthor(slug);
        if (data) {
          setAuthor(data);
        } else {
          setError("Author not found");
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("503")) {
          setError("Service temporarily unavailable. Please try again later.");
        } else {
          setError("Failed to load author");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [slug]);

  useEffect(() => {
    if (isModernAuthor || !author) return;

    const fetchQuotes = async (page: number, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      }

      try {
        const data = await getQuotesByAuthorSlug(slug, page, QUOTES_PER_LOAD);

        if (append) {
          setQuotes((prev) => {
            const combined = [...prev, ...data.results];
            const unique = combined.filter((q, idx, arr) => arr.findIndex((x) => x._id === q._id) === idx);
            return unique;
          });
        } else {
          setQuotes(data.results);
        }

        setTotalCount(data.totalCount);
        setCurrentPage(page);
        setHasMore(page < data.totalPages);
      } catch (err) {
        console.error("Failed to load quotes:", err);
      } finally {
        setLoadingMore(false);
      }
    };

    fetchQuotes(1, false);
  }, [slug, author, isModernAuthor]);

  const handleLoadMore = async () => {
    if (isModernAuthor) return;

    setLoadingMore(true);
    try {
      const data = await getQuotesByAuthorSlug(slug, currentPage + 1, QUOTES_PER_LOAD);
      setQuotes((prev) => {
        const combined = [...prev, ...data.results];
        const unique = combined.filter((q, idx, arr) => arr.findIndex((x) => x._id === q._id) === idx);
        return unique;
      });
      setCurrentPage(currentPage + 1);
      setHasMore(currentPage + 1 < data.totalPages);
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AuthorCardSkeleton />
        <div className="mt-6">
          <QuoteListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {error || "Author Not Found"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              We couldn&apos;t find this author. They may not be in our database yet.
            </p>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center gap-2">
                <Users className="w-3 h-3" />
                Popular authors:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_AUTHORS.slice(0, 4).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/author/${a.slug}`}
                    className="px-3 py-1.5 glass-subtle rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20 flex-shrink-0">
              {author.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {author.name}
                  </h1>
                  {author.description && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {author.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 glass-subtle rounded-full">
                  <QuoteIcon className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {totalCount} quotes
                  </span>
                </div>
              </div>

              {isModernAuthor && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20">
                  <Sparkles className="w-3 h-3 text-primary-500" />
                  <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400">Modern Author</span>
                </div>
              )}

              {author.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <QuoteIcon className="w-4 h-4 text-primary-500" />
              Quotes
            </h2>
          </div>

          {quotes.length > 0 ? (
            <>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {quotes.map((quote, index) => (
                    <motion.div
                      key={quote._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <QuoteCard quote={quote} showFullMeta={false} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center"
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

              {!hasMore && quotes.length > 0 && (
                <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                  Showing all {quotes.length} quotes
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="glass-card rounded-xl p-6 inline-block">
                <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No quotes found for this author.
                </p>
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
