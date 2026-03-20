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
          whileTap={{ scale: 0.97 }}
          onClick={() => onEraSelect(option.value)}
          className={`pill ${selectedEra === option.value ? "pill-active" : ""}`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}
