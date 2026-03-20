"use client";

import { motion } from "framer-motion";
import { AuthorCategory } from "@/lib/types";
import { AUTHOR_CATEGORIES } from "@/lib/api/quotes";

interface CategoryFilterProps {
  selectedCategory: AuthorCategory | null;
  onCategorySelect: (category: AuthorCategory | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill
        active={selectedCategory === null}
        onClick={() => onCategorySelect(null)}
      >
        All
      </FilterPill>
      {AUTHOR_CATEGORIES.map((category) => (
        <FilterPill
          key={category.value}
          active={selectedCategory === category.value}
          onClick={() => onCategorySelect(selectedCategory === category.value ? null : category.value)}
        >
          <span>{category.icon}</span>
          <span>{category.label}</span>
        </FilterPill>
      ))}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`pill ${active ? "pill-active" : ""}`}
    >
      {children}
    </motion.button>
  );
}
