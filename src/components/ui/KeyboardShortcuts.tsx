"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, RefreshCw, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        router.push("/search");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/10 bg-[rgba(10,10,15,0.95)] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#00d4ff,#7c3aed)] text-black">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-text-muted)]">Controls</p>
                  <h2 className="text-lg font-bold">Keyboard shortcuts</h2>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full border border-white/10 p-2 text-[var(--color-text-secondary)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              <Shortcut rowIcon={RefreshCw} label="Get a new random quote" keys={["Space"]} />
              <Shortcut rowIcon={Search} label="Open search" keys={["/"]} />
              <Shortcut rowIcon={X} label="Close overlays" keys={["Esc"]} />
              <Shortcut rowIcon={Keyboard} label="Toggle this panel" keys={["?"]} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Shortcut({ rowIcon: Icon, label, keys }: { rowIcon: React.ElementType; label: string; keys: string[] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <Icon className="h-4 w-4 text-[var(--color-accent-primary)]" />
      <span className="flex-1">{label}</span>
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd key={key} className="rounded-lg border border-white/10 bg-white/8 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
