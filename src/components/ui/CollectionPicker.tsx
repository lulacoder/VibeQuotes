"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCollections } from "@/context/CollectionsContext";
import { useToast } from "@/context/ToastContext";
import { X, Plus, Check, MagnifyingGlass } from "@phosphor-icons/react";

const COLOR_MAP: Record<string, string> = {
  gold: "#d4a853",
  sage: "#6b8f71",
  ember: "#b45353",
  smoke: "#8a8a8a",
};

interface CollectionPickerProps {
  quoteId: string;
  onClose: () => void;
}

export function CollectionPicker({ quoteId, onClose }: CollectionPickerProps) {
  const { collections, addToCollection, removeFromCollection, createCollection, getCollectionsForQuote } = useCollections();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const inCollections = getCollectionsForQuote(quoteId);
  const inIds = new Set(inCollections.map((c) => c.id));

  const filtered = search.trim()
    ? collections.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : collections;

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleToggle = useCallback(
    (collectionId: string, collectionName: string) => {
      if (inIds.has(collectionId)) {
        removeFromCollection(collectionId, quoteId);
        addToast(`Removed from ${collectionName}`, "info");
      } else {
        addToCollection(collectionId, quoteId);
        addToast(`Added to ${collectionName}`, "success");
      }
    },
    [quoteId, inIds, addToCollection, removeFromCollection, addToast]
  );

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return;
    const newId = `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    createCollection(newName.trim());
    addToCollection(newId, quoteId);
    addToast(`Created "${newName.trim()}" and added quote`, "success");
    setNewName("");
    setCreating(false);
  }, [newName, quoteId, createCollection, addToCollection, addToast]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ type: "spring", duration: 0.25 }}
        className="fixed left-4 right-4 top-1/2 z-50 mx-auto max-w-[360px] -translate-y-1/2 overflow-hidden rounded-[20px] border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.15)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-[var(--color-border-hard)] px-5 py-3.5"
          style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), transparent)" }}
        >
          <h4 className="text-[0.95rem] font-extrabold tracking-tight">
            Add to collection
          </h4>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border-hard)] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-3.5 pb-2">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search or create..."
              className="w-full rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] py-2.5 pl-9 pr-4 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent-primary)]"
              style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)" }}
            />
          </div>
        </div>

        {/* Collection list */}
        <div className="max-h-[240px] overflow-y-auto px-3 pb-2">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((col) => {
                const isIn = inIds.has(col.id);
                const color = COLOR_MAP[col.color ?? "smoke"] ?? COLOR_MAP.smoke;
                return (
                  <button
                    key={col.id}
                    onClick={() => handleToggle(col.id, col.name)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      isIn
                        ? "border border-[rgba(14,165,233,0.25)]"
                        : "border border-transparent hover:bg-[var(--color-bg-elevated)]"
                    }`}
                    style={
                      isIn
                        ? { background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(14,165,233,0.03))" }
                        : undefined
                    }
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                        boxShadow: `0 0 8px ${color}40`,
                      }}
                    />
                    <span className={`flex-1 text-sm ${isIn ? "font-bold" : "font-semibold"} text-[var(--color-text-primary)]`}>
                      {col.name}
                    </span>
                    {isIn && (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md text-[0.7rem] font-bold"
                        style={{
                          background: "rgba(14,165,233,0.15)",
                          color: "#38bdf8",
                        }}
                      >
                        <Check className="h-3.5 w-3.5" weight="bold" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="px-3 py-6 text-center text-sm font-medium text-[var(--color-text-muted)]">
              No collections found
            </p>
          )}
        </div>

        {/* Create new */}
        <div className="border-t border-[var(--color-border-hard)] px-4 py-3">
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="flex w-full items-center gap-2.5 rounded-xl border-2 border-dashed border-[var(--color-border-hard)] px-4 py-2.5 text-left transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-elevated)]"
            >
              <Plus className="h-4 w-4 text-[var(--color-text-muted)]" />
              <span className="text-sm font-bold text-[var(--color-text-muted)]">
                Create new collection
              </span>
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Collection name"
                autoFocus
                className="flex-1 rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent-primary)]"
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="rounded-xl bg-[var(--color-accent-primary)] px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                Add
              </button>
              <button
                onClick={() => { setCreating(false); setNewName(""); }}
                className="icon-btn"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
