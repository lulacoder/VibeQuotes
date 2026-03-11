"use client";

import React from "react";
import { motion } from "framer-motion";
import { QuoteEra } from "@/lib/types";
import { Sparkles, Clock, Globe } from "lucide-react";

interface EraFilterProps {
  selectedEra: QuoteEra | "all";
  onEraSelect: (era: QuoteEra | "all") => void;
}

const eraOptions: { value: QuoteEra | "all"; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Time", icon: <Globe className="w-3.5 h-3.5" /> },
  { value: "modern", label: "Modern", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: "classic", label: "Classic", icon: <Clock className="w-3.5 h-3.5" /> },
];

export function EraFilter({ selectedEra, onEraSelect }: EraFilterProps) {
  return (
    <div className="flex items-center gap-1">
      {eraOptions.map((era) => (
        <motion.button
          key={era.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onEraSelect(era.value)}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-all flex items-center gap-2 ${
              selectedEra === era.value
                ? "bg-terracotta-500 text-white"
                : "filter-chip"
            }`}
        >
          {era.icon}
          <span>{era.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
