'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface QuoteDisplayProps {
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  reaction?: 'liked' | 'disliked' | null;
  onReaction?: (type: 'liked' | 'disliked') => void;
  className?: string;
}

export function QuoteDisplay({
  content,
  author,
  authorSlug,
  tags,
  reaction,
  onReaction,
  className,
}: QuoteDisplayProps) {
  return (
    <figure className={cn('max-w-3xl mx-auto text-center', className)}>
      <blockquote className="font-serif text-3xl md:text-4xl leading-relaxed text-var(--text-primary) mb-8">
        &ldquo;{content}&rdquo;
      </blockquote>
      <figcaption className="flex flex-col items-center gap-4">
        <Link
          href={`/author/${authorSlug}`}
          className="text-sm uppercase tracking-widest text-var(--text-secondary) hover:text-var(--text-primary) transition-colors"
        >
          — {author}
        </Link>
        <div className="flex gap-2 flex-wrap justify-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-var(--bg-secondary) text-var(--text-secondary) hover:bg-var(--accent) hover:text-white transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
        {onReaction && (
          <button
            onClick={() => onReaction(reaction === 'liked' ? 'disliked' : 'liked')}
            className="p-2 rounded-full hover:bg-var(--bg-secondary) transition-colors"
            aria-label={reaction === 'liked' ? 'Unlike' : 'Like'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-transform hover:scale-110',
                reaction === 'liked' ? 'fill-red-500 text-red-500' : 'text-var(--text-secondary)'
              )}
            />
          </button>
        )}
      </figcaption>
    </figure>
  );
}
