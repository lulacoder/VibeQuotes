"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";

const STYLES = {
  success: {
    icon:    CheckCircle,
    color:   "var(--color-accent-primary)",
    bg:      "color-mix(in srgb, var(--color-accent-primary) 8%, var(--color-bg-secondary))",
    border:  "color-mix(in srgb, var(--color-accent-primary) 22%, transparent)",
  },
  error: {
    icon:    WarningCircle,
    color:   "var(--color-accent-warm)",
    bg:      "color-mix(in srgb, var(--color-accent-warm) 8%, var(--color-bg-secondary))",
    border:  "color-mix(in srgb, var(--color-accent-warm) 22%, transparent)",
  },
  info: {
    icon:    Info,
    color:   "var(--color-accent-bright)",
    bg:      "color-mix(in srgb, var(--color-accent-bright) 8%, var(--color-bg-secondary))",
    border:  "color-mix(in srgb, var(--color-accent-bright) 22%, transparent)",
  },
} as const;

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex max-w-sm flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const cfg  = STYLES[toast.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, x: 80,  scale: 0.94 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative overflow-hidden rounded-xl border shadow-2xl backdrop-blur-xl"
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              {/* Top color bar */}
              <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: cfg.color }} />

              <div className="flex items-center gap-3 px-4 py-3">
                <Icon weight="fill" className="h-4 w-4 shrink-0" style={{ color: cfg.color }} />
                <p className="flex-1 text-sm font-medium text-[var(--color-text-primary)]">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Countdown bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.5, ease: "linear" }}
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
                style={{ background: cfg.color }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
