"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuotes } from "@/context/QuotesContext";
import { Quote } from "@/lib/types";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  Heart,
  Filter,
  Clock,
  ArrowDownAZ,
  Sparkles,
  Download,
  BookOpen
} from "lucide-react";

type SortOption = "newest" | "oldest" | "author";

export default function LikesPage() {
  const { getLikedQuotes, state, likedCount } = useQuotes();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterAuthor, setFilterAuthor] = useState<string>("");

  const likedReactions = getLikedQuotes();

  const uniqueAuthors = Array.from(
    new Set(likedReactions.map((r) => r.quoteSnapshot.author))
  ).sort();

  const likedQuotes: Quote[] = likedReactions.map((r) => ({
    _id: r.quoteId,
    content: r.quoteSnapshot.content,
    author: r.quoteSnapshot.author,
    authorSlug: r.quoteSnapshot.authorSlug,
    tags: r.quoteSnapshot.tags,
    length: r.quoteSnapshot.content.length,
  }));

  let displayQuotes = [...likedQuotes];

  if (filterAuthor) {
    displayQuotes = displayQuotes.filter((q) => q.author === filterAuthor);
  }

  if (sortBy === "oldest") {
    displayQuotes.reverse();
  } else if (sortBy === "author") {
    displayQuotes.sort((a, b) => a.author.localeCompare(b.author));
  }

  const handleExport = () => {
    const content = displayQuotes
      .map((q) => `"${q.content}" — ${q.author}`)
      .join("\n\n---\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-favorite-quotes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!state.hydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <div className="h-10 w-48 skeleton rounded-xl mx-auto mb-3" />
          <div className="h-4 w-64 skeleton rounded mx-auto mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-tertiary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br from-tertiary-500 to-pink-500 shadow-lg shadow-tertiary-500/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>

          <h1 className="text-2xl font-bold mb-1">
            <span className="gradient-text">Saved Quotes</span>
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {likedCount === 0
              ? "Like quotes to save them here"
              : `${likedCount} quote${likedCount !== 1 ? "s" : ""} saved`}
          </p>
        </motion.header>

        {likedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="glass-card rounded-2xl p-8 max-w-sm mx-auto">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-gray-400" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No saved quotes
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Tap the heart on any quote to save it here. Works offline too.
              </p>

              <Link
                href="/"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Browse Quotes
              </Link>
            </div>
          </motion.div>
        )}

        {likedCount > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <StatsCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-xl p-3 mb-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Filter className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="flex gap-1 p-0.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                    {[
                      { value: "newest", label: "Newest", icon: Clock },
                      { value: "oldest", label: "Oldest", icon: Clock },
                      { value: "author", label: "Author", icon: ArrowDownAZ },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-all ${
                          sortBy === option.value
                            ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                      >
                        <option.icon className="w-3 h-3" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uniqueAuthors.length > 1 && (
                    <select
                      value={filterAuthor}
                      onChange={(e) => setFilterAuthor(e.target.value)}
                      className="px-2 py-1.5 text-xs rounded-lg glass-subtle border-0 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Authors</option>
                      {uniqueAuthors.map((author) => (
                        <option key={author} value={author}>
                          {author}
                        </option>
                      ))}
                    </select>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-subtle text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Export</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {filterAuthor && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400 mb-3"
              >
                {displayQuotes.length} quote{displayQuotes.length !== 1 ? "s" : ""} by{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">{filterAuthor}</span>
                <button
                  onClick={() => setFilterAuthor("")}
                  className="ml-2 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear
                </button>
              </motion.p>
            )}

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {displayQuotes.map((quote, index) => (
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Saved locally, works offline
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}
