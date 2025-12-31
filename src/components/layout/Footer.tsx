"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Github, Sparkles, Twitter, Coffee, Star } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
    { label: "Favorites", href: "/likes" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative mt-auto border-t border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/20"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold gradient-text">VibeQuotes</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Discover wisdom from great minds. Save your favorites, share inspiration,
              and find the perfect quote for every moment.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/lukePeavey/quotable"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-subtle text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 rounded-lg glass-subtle text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="p-2 rounded-lg glass-subtle text-gray-600 dark:text-gray-400 hover:text-tertiary-600 dark:hover:text-tertiary-400 transition-colors"
                aria-label="Buy me a coffee"
              >
                <Coffee className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary-500 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by the{" "}
              <a
                href="https://github.com/lukePeavey/quotable"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Quotable API
              </a>
              . Built with Next.js and Tailwind CSS.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>1000+ Quotes</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                <Heart className="w-3.5 h-3.5 text-tertiary-500" />
                <span>Offline Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
              © {currentYear} VibeQuotes. Made with{" "}
              <Heart className="w-3 h-3 text-tertiary-500 fill-tertiary-500 animate-pulse" />{" "}
              for inspiration seekers
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>v2.0</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>Next.js 16</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>Tailwind V4</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
