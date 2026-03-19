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
      className={cn('relative overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 sm:p-8', className)}
    >
      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--color-text-secondary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Selected quote
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
              New quote
            </button>
          )}
        </div>

        <blockquote className="max-w-3xl text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text-primary)]">
          “{content}”
        </blockquote>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Link href={`/author/${authorSlug}`} className="inline-flex items-center gap-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]">
            <span className="h-px w-8 bg-[var(--color-accent-primary)]" />
            {author}
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onReaction?.(reaction === 'liked' ? 'disliked' : 'liked')}
              aria-label={reaction === 'liked' ? 'Remove like' : 'Like quote'}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-md border transition-colors',
                reaction === 'liked'
                  ? 'border-[rgba(255,107,157,0.35)] bg-[rgba(255,107,157,0.1)] text-[var(--color-accent-tertiary)]'
                  : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              )}
            >
              <Heart className={cn('h-4 w-4', reaction === 'liked' && 'fill-current')} />
            </button>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-8 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-text-secondary)]">
            <div className="flex flex-wrap gap-3">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.figure>
  );
}
