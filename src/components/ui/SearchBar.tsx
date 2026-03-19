"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

const SEARCH_SUGGESTIONS = [
  "love",
  "wisdom",
  "success",
  "happiness",
  "life",
  "motivation",
  "courage",
  "dreams",
];

export function SearchBar({
  placeholder = "Search quotes or authors...",
  autoFocus = false,
  defaultValue = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue || searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setShowSuggestions(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch?.(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) {
          params.set("q", value.trim());
          params.delete("page");
        } else {
          params.delete("q");
        }
        router.push(`/search?${params.toString()}`);
      }, 400);
    },
    [router, searchParams, onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    router.push("/search");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("q", query.trim());
    }
    onSearch?.(query);
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/search?q=${suggestion}`);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div className={`relative rounded-[12px] border bg-[var(--color-bg-primary)] transition-colors ${isFocused ? "border-[rgba(0,212,170,0.4)]" : "border-[var(--color-border)]"
          }`}>
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <Search className={`h-5 w-5 ${isFocused ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-muted)]"}`} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="ui-input pl-12 pr-20 text-base"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClear}
                  className="rounded-md p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-white/5 hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {!query && !isFocused && (
              <kbd className="hidden rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text-muted)] sm:inline-flex">
                /
              </kbd>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSuggestions && !query && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4"
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
                <Sparkles className="w-3 h-3" />
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[rgba(0,212,170,0.35)] hover:text-[var(--color-text-primary)]"
                  >
                    {suggestion}
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-center text-xs text-[var(--color-text-muted)]"
      >
        Press <kbd className="mx-1 rounded-md border border-[var(--color-border)] px-1.5 py-0.5">/</kbd> to focus · <kbd className="mx-1 rounded-md border border-[var(--color-border)] px-1.5 py-0.5">Esc</kbd> to close
      </motion.p>
    </form>
  );
}
