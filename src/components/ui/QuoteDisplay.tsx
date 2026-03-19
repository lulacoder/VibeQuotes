'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface QuoteDisplayProps {
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  reaction?: 'liked' | 'disliked' | null;
  onReaction?: (type: 'liked' | 'disliked') => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function QuoteDisplay({
  content,
  author,
  authorSlug,
  tags,
  reaction,
  onReaction,
  onRefresh,
  isRefreshing,
  className,
}: QuoteDisplayProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 sm:p-10', className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,212,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,0.1),transparent_30%)]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,212,255,0.18)] bg-[rgba(0,212,255,0.08)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[var(--color-accent-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Featured quote
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
              New quote
            </button>
          )}
        </div>

        <blockquote className="max-w-3xl text-[clamp(2rem,4vw,4.6rem)] font-black leading-[0.98] tracking-[-0.05em] text-[var(--color-text-primary)]">
          “{content}”
        </blockquote>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Link href={`/author/${authorSlug}`} className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
            <span className="h-px w-10 bg-[var(--color-accent-primary)]" />
            {author}
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onReaction?.(reaction === 'liked' ? 'disliked' : 'liked')}
              aria-label={reaction === 'liked' ? 'Remove like' : 'Like quote'}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all',
                reaction === 'liked'
                  ? 'border-[rgba(255,90,90,0.35)] bg-[rgba(255,90,90,0.14)] text-[#ff7b7b]'
                  : 'border-white/10 bg-white/5 text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)]/30 hover:text-[var(--color-text-primary)]'
              )}
            >
              <Heart className={cn('h-4 w-4', reaction === 'liked' && 'fill-current')} />
            </button>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/8 pt-5">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.figure>
  );
}
