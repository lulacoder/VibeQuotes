"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const toastConfig = {
  success: {
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
  },
  error: {
    icon: AlertCircle,
    gradient: "from-red-500 to-rose-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
  },
  info: {
    icon: Info,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4 }}
              className={`relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-lg border ${config.bg} ${config.border}`}
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />

              <div className="flex items-center gap-3 px-4 py-3">
                {/* Icon */}
                <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-br ${config.gradient}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Message */}
                <p className={`flex-1 text-sm font-medium ${config.text}`}>
                  {toast.message}
                </p>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeToast(toast.id)}
                  className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${config.text} opacity-60 hover:opacity-100 transition-opacity`}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient} origin-left`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
