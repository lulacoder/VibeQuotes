"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, ArrowClockwise, MagnifyingGlass, X } from "@phosphor-icons/react";
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-primary)] text-[#141210]">
                  <Keyboard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Controls</p>
                  <h2 className="font-display text-lg font-semibold">Keyboard shortcuts</h2>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="icon-btn">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <Shortcut rowIcon={ArrowClockwise} label="New random quote" keys={["Space"]} />
              <Shortcut rowIcon={MagnifyingGlass} label="Open search" keys={["/"]} />
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
    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
      <Icon className="h-4 w-4 text-[var(--color-accent-primary)]" />
      <span className="flex-1">{label}</span>
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd key={key}>{key}</kbd>
        ))}
      </div>
    </div>
  );
}
