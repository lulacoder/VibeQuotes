"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Github, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="border-t border-gray-200/50 dark:border-gray-800/50 mt-12"
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">VibeQuotes</span>
          </Link>

          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
            © {currentYear} Made with{" "}
            <Heart className="w-3 h-3 text-tertiary-500 fill-tertiary-500" />{" "}
            for inspiration seekers
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/likes"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Saved
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
