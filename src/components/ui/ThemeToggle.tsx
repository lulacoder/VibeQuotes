"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return Monitor;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, rotate: 15 }}
      onClick={cycleTheme}
      className="relative p-2.5 rounded-xl glass-subtle text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors overflow-hidden group"
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {/* Background glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Icon with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10"
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle indicator dot */}
      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-300 ${theme === "light"
          ? "bg-amber-400"
          : theme === "dark"
            ? "bg-indigo-400"
            : "bg-gray-400"
        }`} />
    </motion.button>
  );
}
