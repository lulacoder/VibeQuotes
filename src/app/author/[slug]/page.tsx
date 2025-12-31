"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Author, Quote, PaginatedQuotes } from "@/lib/types";
import { getAuthor, getQuotesByAuthor, POPULAR_AUTHORS } from "@/lib/api/quotable";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { AuthorCardSkeleton, QuoteListSkeleton } from "@/components/ui/Skeleton";
import {
  User,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote as QuoteIcon
} from "lucide-react";

export default function AuthorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [quotes, setQuotes] = useState<PaginatedQuotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Fetch author info
  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuthor(slug);
        setAuthor(data);
        if (!data) {
          setError("Author not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load author"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [slug]);

  // Fetch author's quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      setQuotesLoading(true);
      try {
        const data = await getQuotesByAuthor(slug, page, 10);
        setQuotes(data);
      } catch (err) {
        console.error("Failed to load quotes:", err);
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchQuotes();
  }, [slug, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <AuthorCardSkeleton />
        <div className="mt-12">
          <QuoteListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="glass-card rounded-3xl p-12 max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Author Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We couldn&apos;t find an author with this name. They may not be in our database yet.
            </p>

            {/* Back Link */}
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>

            {/* Suggested Authors */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                Try these popular authors:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_AUTHORS.map((author) => (
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
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 mb-12 overflow-hidden relative"
        >
          {/* Background gradient decoration */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="flex-shrink-0"
            >
              <div className="w-28 h-28 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary-500/30 rotate-3 hover:rotate-0 transition-transform">
                {author.name.charAt(0)}
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {author.name}
                  </h1>
                  <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-4">
                    {author.description}
                  </p>
                </div>

                {/* Stats badge */}
                <div className="flex items-center gap-2 px-4 py-2 glass-subtle rounded-full">
                  <QuoteIcon className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {author.quoteCount} quotes
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {author.bio}
              </p>

              {/* Links */}
              {author.link && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={author.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 glass-subtle rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:shadow-md transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn more on Wikipedia
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quotes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            Quotes by {author.name}
          </h2>

          {quotesLoading ? (
            <QuoteListSkeleton count={3} />
          ) : quotes && quotes.results.length > 0 ? (
            <>
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {quotes.results.map((quote, index) => (
                    <QuoteCard
                      key={quote._id}
                      quote={quote}
                      animationDelay={index * 0.05}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {quotes.totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-3 mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-4 py-2 glass-subtle rounded-xl text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>

                  <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Page <span className="font-semibold text-gray-700 dark:text-gray-300">{page}</span> of {quotes.totalPages}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === quotes.totalPages}
                    className="flex items-center gap-1 px-4 py-2 glass-subtle rounded-xl text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="glass-card rounded-2xl p-8 inline-block">
                <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
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
