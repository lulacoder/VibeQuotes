'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowClockwise, Sparkle } from '@phosphor-icons/react';
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
      className={cn(
        'relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-7 sm:p-10 transition-colors duration-300',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent-primary)] to-transparent opacity-20" />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-xs text-[var(--color-text-muted)]">
            <Sparkle weight="duotone" className="h-3 w-3 text-[var(--color-accent-primary)]" />
            Featured
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="icon-btn gap-1.5 px-3 text-xs"
            >
              <ArrowClockwise className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
              New
            </button>
          )}
        </div>

        <blockquote className="quote-text max-w-3xl text-[clamp(1.75rem,3.8vw,3.5rem)] leading-[1.08] text-[var(--color-text-primary)]">
          &ldquo;{content}&rdquo;
        </blockquote>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href={`/author/${authorSlug}`}
            className="group inline-flex items-center gap-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <span className="h-px w-6 bg-[var(--color-accent-primary)] transition-all duration-300 group-hover:w-10" />
            <span className="font-medium">{author}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onReaction?.(reaction === 'liked' ? 'disliked' : 'liked')}
              aria-label={reaction === 'liked' ? 'Remove like' : 'Like quote'}
              className={cn(
                'icon-btn h-10 w-10',
                reaction === 'liked' &&
                  'border-[rgba(212,107,107,0.3)] bg-[rgba(212,107,107,0.08)] text-[var(--color-accent-tertiary)]'
              )}
            >
              <Heart weight={reaction === 'liked' ? 'fill' : 'regular'} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-8 border-t border-[var(--color-border)] pt-5">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.figure>
  );
}
