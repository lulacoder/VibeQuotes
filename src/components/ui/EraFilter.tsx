"use client";

import { motion } from "framer-motion";
import { QuoteEra } from "@/lib/types";
import { ERA_OPTIONS } from "@/lib/api/quotes";

interface EraFilterProps {
  selectedEra: QuoteEra | "all";
  onEraSelect: (era: QuoteEra | "all") => void;
}

export function EraFilter({ selectedEra, onEraSelect }: EraFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ERA_OPTIONS.map((option) => (
        <motion.button
          key={option.value}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEraSelect(option.value)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            selectedEra === option.value
              ? "bg-[var(--color-accent-primary)] text-black"
              : "border border-white/10 bg-white/[0.04] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}
