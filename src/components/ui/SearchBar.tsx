"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X, ArrowRight } from "@phosphor-icons/react";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

const SEARCH_SUGGESTIONS = [
  "love", "wisdom", "success", "happiness",
  "life", "courage", "dreams", "freedom",
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

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
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
      }, 350);
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    onSearch?.(query);
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    router.push(`/search?q=${s}`);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <div
          className={`relative flex items-center rounded-xl border bg-[var(--color-bg-primary)] transition-all duration-200 ${
            isFocused
              ? "border-[var(--color-accent-primary)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent-primary)_12%,transparent)]"
              : "border-[var(--color-border-hard)]"
          }`}
        >
          <div className="pointer-events-none pl-4">
            <MagnifyingGlass
              weight={isFocused ? "bold" : "regular"}
              className={`h-[18px] w-[18px] transition-colors duration-200 ${
                isFocused ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-muted)]"
              }`}
            />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent py-3.5 pl-3 pr-2 font-body text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />

          <div className="flex items-center gap-1.5 pr-3">
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClear}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
            {!query && !isFocused && <kbd>/</kbd>}
          </div>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && !query && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] p-4 shadow-xl"
            >
              <p className="section-eyebrow mb-3">Popular</p>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.025 }}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="pill gap-1"
                  >
                    {s}
                    <ArrowRight className="h-3 w-3" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-2 text-center font-mono text-xs text-[var(--color-text-muted)]">
        <kbd>/</kbd> to focus &middot; <kbd>Esc</kbd> to close
      </p>
    </form>
  );
}
