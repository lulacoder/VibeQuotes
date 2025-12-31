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
  Search,
  Filter,
  Clock,
  ArrowDownAZ,
  Sparkles,
  Download,
  Grid,
  List,
  BookOpen
} from "lucide-react";

type SortOption = "newest" | "oldest" | "author";
type ViewMode = "list" | "grid";

export default function LikesPage() {
  const { getLikedQuotes, state, likedCount } = useQuotes();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterAuthor, setFilterAuthor] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const likedReactions = getLikedQuotes();

  // Get unique authors from liked quotes
  const uniqueAuthors = Array.from(
    new Set(likedReactions.map((r) => r.quoteSnapshot.author))
  ).sort();

  // Convert reactions to quotes for QuoteCard compatibility
  const likedQuotes: Quote[] = likedReactions.map((r) => ({
    _id: r.quoteId,
    content: r.quoteSnapshot.content,
    author: r.quoteSnapshot.author,
    authorSlug: r.quoteSnapshot.authorSlug,
    tags: r.quoteSnapshot.tags,
    length: r.quoteSnapshot.content.length,
  }));

  // Filter and sort
  let displayQuotes = [...likedQuotes];

  if (filterAuthor) {
    displayQuotes = displayQuotes.filter((q) => q.author === filterAuthor);
  }

  if (sortBy === "oldest") {
    displayQuotes.reverse();
  } else if (sortBy === "author") {
    displayQuotes.sort((a, b) => a.author.localeCompare(b.author));
  }

  // Export functionality
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

  // Wait for hydration
  if (!state.hydrated) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center">
          <div className="h-12 w-64 skeleton rounded-xl mx-auto mb-4" />
          <div className="h-5 w-80 skeleton rounded mx-auto mb-12" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 skeleton rounded-3xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-tertiary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-tertiary-500 to-pink-500 shadow-lg shadow-tertiary-500/30"
          >
            <Heart className="w-10 h-10 text-white fill-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Your Favorites</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {likedCount === 0
              ? "Start liking quotes to build your collection"
              : `${likedCount} inspiring quote${likedCount !== 1 ? "s" : ""} in your collection`}
          </p>
        </motion.div>

        {/* Empty State */}
        {likedCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="glass-card rounded-3xl p-12 max-w-lg mx-auto">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-tertiary-100 to-pink-100 dark:from-tertiary-900/30 dark:to-pink-900/30 rounded-full mb-8">
                <BookOpen className="w-14 h-14 text-tertiary-400 dark:text-tertiary-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No favorites yet
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Explore quotes and click the heart icon to save them here.
                Your favorites are stored locally and will persist offline.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Discover Quotes
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Stats Card */}
        {likedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <StatsCard />
          </motion.div>
        )}

        {/* Filters & Controls */}
        {likedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                  {[
                    { value: "newest", label: "Newest", icon: Clock },
                    { value: "oldest", label: "Oldest", icon: Clock },
                    { value: "author", label: "Author", icon: ArrowDownAZ },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all ${sortBy === option.value
                          ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                      <option.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Filter & View Mode */}
              <div className="flex items-center gap-3">
                {uniqueAuthors.length > 1 && (
                  <select
                    value={filterAuthor}
                    onChange={(e) => setFilterAuthor(e.target.value)}
                    className="px-3 py-2 text-sm rounded-xl glass-subtle border-0 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                )}

                {/* View Mode Toggle */}
                <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list"
                        ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                        ? "bg-white dark:bg-gray-700 text-primary-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass-subtle text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Export</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter indicator */}
        {filterAuthor && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2"
          >
            Showing {displayQuotes.length} quote{displayQuotes.length !== 1 ? "s" : ""} by{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">{filterAuthor}</span>
            <button
              onClick={() => setFilterAuthor("")}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filter
            </button>
          </motion.p>
        )}

        {/* Quote List */}
        {displayQuotes.length > 0 && (
          <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
            <AnimatePresence mode="popLayout">
              {displayQuotes.map((quote, index) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  showFullMeta={viewMode === "list"}
                  animationDelay={index * 0.05}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Note */}
        {likedCount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-sm text-gray-400 dark:text-gray-600 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Your favorites are stored locally and work offline
          </motion.p>
        )}
      </div>
    </div>
  );
}
