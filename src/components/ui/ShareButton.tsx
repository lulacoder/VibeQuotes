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
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-md border p-2.5 transition-colors ${isOpen
            ? "border-[rgba(0,212,170,0.35)] bg-[rgba(0,212,170,0.1)] text-[var(--color-accent-primary)]"
            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
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
              className="absolute right-0 top-full z-50 mt-2 min-w-[220px] rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 rounded-md p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="mb-3 pr-6 text-xs font-medium text-[var(--color-text-muted)]">
                Share this quote
              </p>

              <div className="space-y-1">
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                    </motion.a>
                  );
                })}

                <div className="my-2 h-px bg-[var(--color-border)]" />

                <motion.button
                  onClick={handleCopyLink}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${copied
                      ? "text-[var(--color-accent-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                    }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
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
