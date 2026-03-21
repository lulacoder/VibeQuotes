"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCollections } from "@/context/CollectionsContext";
import { useToast } from "@/context/ToastContext";
import { getQuoteById } from "@/lib/api/quotes";
import type { Quote } from "@/lib/types";
import {
  ArrowLeft,
  PencilSimple,
  Trash,
  X,
  BookOpenText,
  Sparkle,
} from "@phosphor-icons/react";

const COLOR_MAP: Record<string, string> = {
  gold: "#d4a853",
  sage: "#6b8f71",
  ember: "#b45353",
  smoke: "#8a8a8a",
};

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { collections, updateCollection, deleteCollection, removeFromCollection, hydrated } = useCollections();
  const { addToast } = useToast();

  const collection = useMemo(() => collections.find((c) => c.id === id), [collections, id]);

  const [resolvedQuotes, setResolvedQuotes] = useState<
    Array<{ id: string; quote: Quote | null }>
  >([]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editColor, setEditColor] = useState("gold");

  useEffect(() => {
    if (!collection) return;
    const resolved = collection.quoteIds.map((qid) => ({
      id: qid,
      quote: getQuoteById(qid) ?? null,
    }));
    setResolvedQuotes(resolved);
  }, [collection]);

  useEffect(() => {
    if (collection) {
      setEditName(collection.name);
      setEditDesc(collection.description ?? "");
      setEditColor(collection.color ?? "gold");
    }
  }, [collection]);

  const handleSaveEdit = useCallback(() => {
    if (!editName.trim() || !collection) return;
    updateCollection(collection.id, editName.trim(), editDesc.trim() || undefined, editColor);
    addToast("Collection updated", "success");
    setEditing(false);
  }, [editName, editDesc, editColor, collection, updateCollection, addToast]);

  const handleDelete = useCallback(() => {
    if (!collection) return;
    deleteCollection(collection.id);
    addToast("Collection deleted", "info");
    router.push("/collections");
  }, [collection, deleteCollection, addToast, router]);

  const handleRemoveQuote = useCallback(
    (quoteId: string) => {
      if (!collection) return;
      removeFromCollection(collection.id, quoteId);
      addToast("Removed from collection", "info");
    },
    [collection, removeFromCollection, addToast]
  );

  if (!hydrated) {
    return (
      <main className="relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="shimmer h-8 w-64 rounded-lg" />
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <BookOpenText weight="duotone" className="mx-auto mb-4 h-10 w-10 text-[var(--color-text-muted)]" />
          <h2 className="font-display text-2xl font-bold">Collection not found</h2>
          <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
            This collection may have been deleted.
          </p>
          <Link href="/collections" className="btn-primary mt-6 inline-flex">
            <ArrowLeft className="h-4 w-4" />
            Back to collections
          </Link>
        </div>
      </main>
    );
  }

  const color = COLOR_MAP[collection.color ?? "smoke"] ?? COLOR_MAP.smoke;

  return (
    <main className="noise-overlay relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
      <div className="teal-orb" style={{ width: 500, height: 500, top: 80, right: -200 }} />

      <div className="relative z-10 mx-auto max-w-4xl pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Collections
          </Link>
          <span className="mx-2 text-[var(--color-text-muted)]">/</span>
          <span className="text-sm font-bold" style={{ color }}>
            {collection.name}
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <h1 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] font-black leading-[1.1] tracking-[-0.02em]">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-2 max-w-lg text-base font-medium text-[var(--color-text-secondary)]">
                {collection.description}
              </p>
            )}
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--color-bg-secondary)]"
            >
              <PencilSimple className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => setDeleting(true)}
              className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-accent-warm)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_8%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--color-accent-warm)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent-warm)_15%,transparent)]"
            >
              <Trash className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <span
            className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
            style={{
              borderColor: `${color}40`,
              background: `${color}10`,
              color,
            }}
          >
            {resolvedQuotes.length} quote{resolvedQuotes.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-2 rounded-full border border-[var(--color-border-hard)] bg-[var(--color-bg-elevated)] px-4 py-1.5 text-sm font-medium text-[var(--color-text-muted)]">
            Created {new Date(collection.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </motion.div>

        {/* Delete confirmation */}
        <AnimatePresence>
          {deleting && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5 flex items-center justify-between rounded-xl border border-[color-mix(in_srgb,var(--color-accent-warm)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_8%,transparent)] px-5 py-4"
            >
              <p className="text-sm font-semibold text-[var(--color-accent-warm)]">
                Delete this collection?
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setDeleting(false)}
                  className="rounded-lg border border-[var(--color-border-hard)] px-3 py-1.5 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-[var(--color-accent-warm)] px-3 py-1.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5 rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-bold">Edit collection</h3>
                <button onClick={() => setEditing(false)} className="icon-btn">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Name
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent-primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description
                  </label>
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent-primary)]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Color
                  </label>
                  <div className="flex gap-3">
                    {Object.entries(COLOR_MAP).map(([name, hex]) => (
                      <button
                        key={name}
                        onClick={() => setEditColor(name)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                          editColor === name
                            ? "border-current shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        style={{ color: hex }}
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: hex, boxShadow: `0 0 8px ${hex}40` }}
                        />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setEditing(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim()}
                    className="btn-primary flex-1 disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quotes list */}
        <div className="mt-8 space-y-4">
          {resolvedQuotes.length > 0 ? (
            resolvedQuotes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                {item.quote ? (
                  <div
                    className="rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-6 transition-colors duration-300"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <p className="text-[1.1rem] font-semibold leading-relaxed">
                      &ldquo;{item.quote.content}&rdquo;
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-hard)] pt-3">
                      <Link
                        href={`/author/${item.quote.authorSlug}`}
                        className="text-sm font-semibold text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
                      >
                        — {item.quote.author}
                      </Link>
                      <button
                        onClick={() => handleRemoveQuote(item.id)}
                        className="rounded-lg border border-[color-mix(in_srgb,var(--color-accent-warm)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_8%,transparent)] px-3 py-1.5 text-xs font-bold text-[var(--color-accent-warm)] transition-opacity hover:opacity-80"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-6 text-center">
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                      Quote unavailable
                    </p>
                    <button
                      onClick={() => handleRemoveQuote(item.id)}
                      className="mt-3 rounded-lg border border-[var(--color-border-hard)] px-3 py-1.5 text-xs font-bold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-14 text-center"
            >
              <Sparkle weight="duotone" className="mx-auto mb-4 h-8 w-8 text-[var(--color-accent-primary)]" />
              <h2 className="font-display text-xl font-bold">No quotes yet</h2>
              <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Browse the archive and add quotes to this collection.
              </p>
              <Link href="/search" className="btn-primary mt-5 inline-flex">
                Browse archive
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
