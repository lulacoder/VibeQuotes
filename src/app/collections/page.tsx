"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCollections, type Collection } from "@/context/CollectionsContext";
import { useToast } from "@/context/ToastContext";
import { Plus, X, Folders, Sparkle } from "@phosphor-icons/react";

const COLOR_MAP: Record<string, string> = {
  gold: "#d4a853",
  sage: "#6b8f71",
  ember: "#b45353",
  smoke: "#8a8a8a",
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CollectionsPage() {
  const { collections, createCollection, hydrated } = useCollections();
  const { addToast } = useToast();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("gold");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    createCollection(newName.trim(), newDesc.trim() || undefined, newColor);
    addToast("Collection created", "success");
    setNewName("");
    setNewDesc("");
    setNewColor("gold");
    setShowCreate(false);
    router.push(`/collections/${id}`);
  };

  if (!hydrated) {
    return (
      <main className="relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="shimmer h-8 w-48 rounded-lg" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="noise-overlay relative min-h-screen bg-[var(--color-bg-primary)] px-5 pt-24 text-[var(--color-text-primary)] transition-colors duration-300 lg:px-10">
      <div className="teal-orb" style={{ width: 600, height: 600, top: 100, right: -200 }} />

      <div className="relative z-10 mx-auto max-w-6xl pb-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl"
        >
          <p className="section-eyebrow mb-3">Your archive</p>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.06] tracking-[-0.02em]">
            Collections.
          </h1>
          <p className="mt-3 max-w-lg text-base font-medium text-[var(--color-text-secondary)]">
            Organize quotes that matter. All stored locally.
          </p>
        </motion.div>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            New collection
          </button>
        </motion.div>

        {/* Collection grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CollectionCard collection={col} />
            </motion.div>
          ))}

          {/* Empty state card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: collections.length * 0.05 + 0.1 }}
            onClick={() => setShowCreate(true)}
            className="group cursor-pointer rounded-2xl border-2 border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] p-6 text-center transition-all duration-200 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)]"
          >
            <Plus className="mx-auto mb-3 h-6 w-6 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:scale-110" />
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">
              Create collection
            </p>
          </motion.div>
        </div>

        {/* Empty state when no collections */}
        {collections.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-2xl border border-dashed border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] p-14 text-center"
          >
            <Sparkle weight="duotone" className="mx-auto mb-4 h-8 w-8 text-[var(--color-accent-primary)]" />
            <h2 className="font-display text-xl font-bold">No collections yet</h2>
            <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
              Create your first collection to start organizing quotes.
            </p>
          </motion.div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed left-4 right-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 overflow-hidden rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border-hard)] bg-[color-mix(in_srgb,var(--color-accent-primary)_6%,transparent)] px-6 py-4">
                <h3 className="font-display text-lg font-bold">New collection</h3>
                <button onClick={() => setShowCreate(false)} className="icon-btn">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Name
                  </label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Morning Motivation"
                    autoFocus
                    className="w-full rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent-primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description (optional)
                  </label>
                  <input
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What's this collection about?"
                    className="w-full rounded-xl border border-[var(--color-border-hard)] bg-[var(--color-bg-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent-primary)]"
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
                        onClick={() => setNewColor(name)}
                        className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                          newColor === name
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
                    onClick={() => setShowCreate(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="btn-primary flex-1 disabled:opacity-40"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const color = COLOR_MAP[collection.color ?? "smoke"] ?? COLOR_MAP.smoke;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group block rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] transition-all duration-300 card-hover"
      style={{
        borderTop: `3px solid ${color}`,
        background: `linear-gradient(135deg, ${color}08, transparent)`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-6">
        <p
          className="section-eyebrow mb-1.5 font-bold"
          style={{ color }}
        >
          {collection.color ?? "smoke"}
        </p>
        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-primary)]">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed text-[var(--color-text-secondary)]">
            {collection.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-hard)] pt-3">
          <span className="font-mono text-xs text-[var(--color-text-muted)]">
            {collection.quoteIds.length} quote{collection.quoteIds.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            {timeAgo(collection.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
