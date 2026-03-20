"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light")  setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icons = { light: Sun, dark: Moon, system: Desktop } as const;
  const Icon = icons[theme as keyof typeof icons] ?? Desktop;

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={cycleTheme}
      className="icon-btn relative overflow-hidden"
      aria-label={`Theme: ${theme}. Click to cycle.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{ y: 14,    opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10"
        >
          <Icon weight="duotone" className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
