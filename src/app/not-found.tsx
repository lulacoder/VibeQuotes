"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search, Sparkles, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="text-center max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1, bounce: 0.4 }}
          className="relative mb-8"
        >
          <span className="text-[150px] md:text-[200px] font-bold gradient-text leading-none">
            404
          </span>

          {/* Floating icon */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/30">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* Glass Card Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Page not found
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like this page wandered off in search of wisdom.
            Let&apos;s get you back on track!
          </p>

          {/* Quote decoration */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/30">
            <p className="text-sm italic text-gray-700 dark:text-gray-300">
              &ldquo;Not all those who wander are lost.&rdquo;
            </p>
            <p className="text-xs text-gray-500 mt-1">— J.R.R. Tolkien</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/search"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Search className="w-4 h-4" />
                Search Quotes
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Easter egg */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Press <kbd className="mx-1">/</kbd> to search
        </motion.p>
      </motion.div>
    </div>
  );
}
