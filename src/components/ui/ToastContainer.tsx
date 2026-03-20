"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";

const toastStyles = {
  success: {
    icon: CheckCircle,
    accent: "var(--color-accent-primary)",
    bg: "rgba(212,165,74,0.06)",
    border: "rgba(212,165,74,0.18)",
  },
  error: {
    icon: WarningCircle,
    accent: "var(--color-accent-tertiary)",
    bg: "rgba(212,107,107,0.06)",
    border: "rgba(212,107,107,0.18)",
  },
  info: {
    icon: Info,
    accent: "var(--color-accent-warm)",
    bg: "rgba(201,135,92,0.06)",
    border: "rgba(201,135,92,0.18)",
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = toastStyles[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl"
              style={{
                background: config.bg,
                borderColor: config.border,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: config.accent }}
              />

              <div className="flex items-center gap-3 px-4 py-3">
                <Icon weight="fill" className="h-4 w-4 shrink-0" style={{ color: config.accent }} />

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

              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3.5, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
                style={{ background: config.accent }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
