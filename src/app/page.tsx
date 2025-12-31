"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "@/lib/types";
import { getRandomQuote, getRandomQuotes } from "@/lib/api/quotable";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuoteCardSkeleton } from "@/components/ui/Skeleton";
import { MoodSelector } from "@/components/ui/MoodSelector";
import { StatsCard } from "@/components/ui/StatsCard";
import {
  RefreshCw,
  Sparkles,
  Wand2,
  Zap,
  Sun,
  Stars,
  TrendingUp
} from "lucide-react";

// Quote of the Day storage key
const QOTD_KEY = "vibequotes-qotd";
const QOTD_DATE_KEY = "vibequotes-qotd-date";

interface QuoteOfTheDay {
  quote: Quote;
  date: string;
}

export default function HomePage() {
  const [mainQuote, setMainQuote] = useState<Quote | null>(null);
  const [suggestions, setSuggestions] = useState<Quote[]>([]);
  const [quoteOfTheDay, setQuoteOfTheDay] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Load Quote of the Day from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(QOTD_DATE_KEY);
    const savedQuote = localStorage.getItem(QOTD_KEY);

    if (savedDate === today && savedQuote) {
      try {
        setQuoteOfTheDay(JSON.parse(savedQuote));
      } catch {
        // Invalid saved quote, will fetch new one
      }
    }
  }, []);

  const fetchQuotes = useCallback(async (tag?: string) => {
    try {
      setRefreshing(true);
      setError(null);

      const [quote, moreLikeThis] = await Promise.all([
        getRandomQuote(tag),
        getRandomQuotes(3, tag),
      ]);

      setMainQuote(quote);
      setSuggestions(moreLikeThis.filter((q) => q._id !== quote._id).slice(0, 3));

      // Save as Quote of the Day if none exists for today
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem(QOTD_DATE_KEY);

      if (savedDate !== today) {
        localStorage.setItem(QOTD_KEY, JSON.stringify(quote));
        localStorage.setItem(QOTD_DATE_KEY, today);
        setQuoteOfTheDay(quote);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load quotes. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQuotes(selectedMood || undefined);
  }, [fetchQuotes, selectedMood]);

  // Keyboard shortcut: "R" to refresh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        fetchQuotes(selectedMood || mainQuote?.tags[0]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchQuotes, mainQuote, selectedMood]);

  const handleRefresh = () => {
    fetchQuotes(selectedMood || undefined);
  };

  const handleMoreLikeThis = (tag: string) => {
    setSelectedMood(null);
    fetchQuotes(tag);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood === selectedMood ? null : mood);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tertiary-100 to-tertiary-200 dark:from-tertiary-900/30 dark:to-tertiary-800/30 rounded-full mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center mb-12"
        >
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle mb-6"
          >
            <Stars className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Daily Inspiration Awaits
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text-animated">
              Discover Wisdom
            </span>
            <br />
            <span className="text-gray-800 dark:text-gray-100">
              From Great Minds
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Explore thousands of inspiring quotes. Save your favorites, share with friends,
            and find the perfect words for every moment.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span>1000+ Quotes</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span>100+ Authors</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <Zap className="w-4 h-4 text-tertiary-500" />
              <span>Offline Ready</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />
        </motion.div>

        {/* Quote of the Day Section */}
        {quoteOfTheDay && !selectedMood && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Quote of the Day
              </h2>
              <span className="ml-auto text-xs text-gray-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric"
                })}
              </span>
            </div>
            <QuoteCard quote={quoteOfTheDay} featured />
          </motion.section>
        )}

        {/* Main Quote Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {selectedMood ? `${selectedMood} Quotes` : "Discover More"}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-subtle text-primary-600 dark:text-primary-400 font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">New Quote</span>
              <kbd className="hidden sm:inline-flex text-[10px]">R</kbd>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <QuoteCardSkeleton key="skeleton" />
            ) : mainQuote ? (
              <QuoteCard key={mainQuote._id} quote={mainQuote} />
            ) : null}
          </AnimatePresence>

          {/* Tag-based "More Like This" buttons */}
          {mainQuote && mainQuote.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Wand2 className="w-4 h-4" />
                More like this:
              </span>
              {mainQuote.tags.slice(0, 4).map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoreLikeThis(tag)}
                  className="px-4 py-1.5 text-sm glass-subtle rounded-full text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md transition-all"
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          )}
        </section>

        {/* Suggestions Grid */}
        {suggestions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full" />
              You Might Also Like
            </h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {suggestions.map((quote, index) => (
                <QuoteCard
                  key={quote._id}
                  quote={quote}
                  showFullMeta={false}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* User Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <StatsCard />
        </motion.div>

        {/* Keyboard Shortcuts Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 glass-subtle rounded-full text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <kbd>R</kbd>
              <span>New quote</span>
            </span>
            <span className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <span className="flex items-center gap-1.5">
              <kbd>/</kbd>
              <span>Search</span>
            </span>
            <span className="w-1 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <span className="flex items-center gap-1.5">
              <kbd>?</kbd>
              <span>Shortcuts</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
