"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight, DotsThree } from "@phosphor-icons/react";

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

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
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
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={`icon-btn gap-1 px-3 text-sm ${
          currentPage === 1 ? "pointer-events-none opacity-40" : ""
        }`}
        aria-disabled={currentPage === 1}
      >
        <CaretLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-[var(--color-text-muted)]"
              >
                <DotsThree className="h-4 w-4" />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Link key={page} href={createPageUrl(page)} className="relative">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--color-accent-primary)] text-[#141210]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {page}
              </motion.div>
            </Link>
          );
        })}
      </div>

      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={`icon-btn gap-1 px-3 text-sm ${
          currentPage === totalPages ? "pointer-events-none opacity-40" : ""
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <CaretRight className="h-4 w-4" />
      </Link>
    </motion.nav>
  );
}
