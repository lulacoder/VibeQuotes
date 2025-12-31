"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 2; // Pages to show on each side of current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-center gap-2 mt-10"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentPage === 1
            ? "pointer-events-none opacity-40 glass-subtle text-gray-400"
            : "glass-subtle text-gray-700 dark:text-gray-300 hover:shadow-md hover:text-primary-600 dark:hover:text-primary-400"
          }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${isActive
                    ? "text-white"
                    : "glass-subtle text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
              >
                {page}

                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="activePage"
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl -z-10 shadow-lg shadow-primary-500/30"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentPage === totalPages
            ? "pointer-events-none opacity-40 glass-subtle text-gray-400"
            : "glass-subtle text-gray-700 dark:text-gray-300 hover:shadow-md hover:text-primary-600 dark:hover:text-primary-400"
          }`}
        aria-disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.nav>
  );
}
