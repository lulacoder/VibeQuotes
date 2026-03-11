"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuthorCategory } from "@/lib/types";
import { AUTHOR_CATEGORIES } from "@/lib/api/quotes";

interface CategoryFilterProps {
  selectedCategory: AuthorCategory | null;
  onCategorySelect: (category: AuthorCategory | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto -mx-6 px-6">
      <div className="flex gap-2 pb-2 min-w-max">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect(null)}
          className={`px-4 py-2 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${
            selectedCategory === null
              ? "bg-terracotta-500 text-white"
              : "filter-chip"
          }`}
        >
          All
        </motion.button>
        {AUTHOR_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(selectedCategory === cat.value ? null : cat.value)}
            className={`px-4 py-2 rounded-sm text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat.value
                ? "bg-terracotta-500 text-white"
                : "filter-chip"
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
