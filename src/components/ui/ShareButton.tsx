"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check, X } from "lucide-react";
import { Quote } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

interface ShareButtonProps {
  quote: Quote;
}

export function ShareButton({ quote }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const shareText = `"${quote.content}" — ${quote.author}`;
  const encodedText = encodeURIComponent(shareText);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}`,
      color: "hover:bg-blue-500 hover:text-white",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      color: "hover:bg-blue-600 hover:text-white",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-700 hover:text-white",
      gradient: "from-blue-600 to-blue-800",
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      addToast("Quote copied to clipboard!", "success");
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      addToast("Failed to copy", "error");
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen
            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
            : "text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          }`}
        aria-label="Share quote"
      >
        <Share2 className="w-5 h-5" />
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute right-0 top-full mt-2 z-50 glass-card rounded-2xl p-3 shadow-xl min-w-[200px]"
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 pr-6">
                Share this quote
              </p>

              <div className="space-y-1">
                {/* Social Links */}
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-medium transition-all ${link.color}`}
                    >
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${link.gradient}`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      {link.name}
                    </motion.a>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                {/* Copy Link */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyLink}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${copied
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  <div className={`p-1.5 rounded-lg ${copied
                      ? "bg-green-500"
                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                    }`}>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  {copied ? "Copied!" : "Copy Quote"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
