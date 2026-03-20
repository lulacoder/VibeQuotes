"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareNetwork, XLogo, FacebookLogo, LinkedinLogo, LinkSimple, Check, X } from "@phosphor-icons/react";
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
      icon: XLogo,
      url: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      name: "Facebook",
      icon: FacebookLogo,
      url: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedinLogo,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      addToast("Quote copied", "success");
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
    } catch {
      addToast("Failed to copy", "error");
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`icon-btn ${isOpen ? "border-[var(--color-border-hover)] text-[var(--color-accent-primary)]" : ""}`}
        aria-label="Share quote"
      >
        <ShareNetwork className="h-3.5 w-3.5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2.5 shadow-xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-2.5 top-2.5 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <p className="mb-2.5 pr-6 text-[0.7rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Share
              </p>

              <div className="space-y-0.5">
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent-primary)_6%,transparent)] hover:text-[var(--color-text-primary)]"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.name}
                    </a>
                  );
                })}

                <div className="my-1.5 h-px bg-[var(--color-border)]" />

                <button
                  onClick={handleCopyLink}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                    copied
                      ? "text-[var(--color-accent-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-accent-primary)_6%,transparent)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <LinkSimple className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy quote"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
