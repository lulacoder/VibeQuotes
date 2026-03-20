'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowClockwise, Sparkle, Copy } from '@phosphor-icons/react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { useToast } from '@/context/ToastContext';

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
  const { addToast } = useToast();

  const copyQuote = async () => {
    await navigator.clipboard.writeText(`"${content}" — ${author}`);
    addToast('Copied to clipboard', 'success');
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-hard)] bg-[var(--color-bg-secondary)] transition-colors duration-300',
        className
      )}
    >
      {/* Teal top accent */}
      <div className="h-[2px] bg-[var(--color-accent-primary)]" />

      <div className="flex flex-1 flex-col p-7 sm:p-10">
        {/* Header row */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <span className="section-eyebrow flex items-center gap-1.5">
            <Sparkle weight="fill" className="h-3 w-3" />
            Daily pick
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="icon-btn gap-1.5 px-3 text-xs"
            >
              <ArrowClockwise className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} />
              <span className="font-body text-xs">New</span>
            </button>
          )}
        </div>

        {/* Quote */}
        <blockquote className="quote-text flex-1 text-[clamp(1.6rem,3.5vw,3rem)] leading-tight text-[var(--color-text-primary)]">
          &ldquo;{content}&rdquo;
        </blockquote>

        {/* Author + actions row */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <Link
            href={`/author/${authorSlug}`}
            className="group flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent-primary)]"
          >
            <span className="h-px w-5 bg-[var(--color-accent-primary)] transition-all duration-300 group-hover:w-8" />
            <span className="font-medium">{author}</span>
          </Link>

          {/* Action cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={copyQuote}
              aria-label="Copy quote"
              className="icon-btn"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onReaction?.(reaction === 'liked' ? 'disliked' : 'liked')}
              aria-label={reaction === 'liked' ? 'Remove like' : 'Like quote'}
              className={cn(
                'icon-btn',
                reaction === 'liked' &&
                  'border-[color-mix(in_srgb,var(--color-accent-warm)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-warm)_10%,transparent)] text-[var(--color-accent-warm)]'
              )}
            >
              <Heart weight={reaction === 'liked' ? 'fill' : 'regular'} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-6 border-t border-[var(--color-border-hard)] pt-4">
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 5).map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.figure>
  );
}
