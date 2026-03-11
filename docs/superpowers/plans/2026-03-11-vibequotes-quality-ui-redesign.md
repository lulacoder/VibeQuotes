# VibeQuotes Quality & UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform VibeQuotes into a minimalist, editorial-style quote discovery app with improved code quality, performance, and animations.

**Architecture:** 
- Replace card-based UI with typography-focused editorial layout
- Add React Query for API caching and state management
- Implement error boundaries per route
- Use CSS variables for theming with dark mode support

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, @tanstack/react-query, Jest

---

## Chunk 1: Foundation Setup

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add React Query dependency**

Run: `npm install @tanstack/react-query@latest`
Expected: Package added to package.json

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @tanstack/react-query for API caching"
```

---

### Task 2: Create Utility Functions

**Files:**
- Create: `src/lib/utils/cn.ts`
- Test: `src/lib/utils/cn.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/utils/cn.test.ts
import { cn } from './cn';

describe('cn', () => {
  it('merges classNames', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('handles undefined and null', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="cn.test.ts" -v`
Expected: FAIL with "Cannot find module './cn'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/lib/utils/cn.ts
type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x) => typeof x === 'string' && x !== '')
    .join(' ');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="cn.test.ts" -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/cn.ts src/lib/utils/cn.test.ts
git commit -m "feat: add cn utility for className merging"
```

---

### Task 3: Update Types

**Files:**
- Modify: `src/lib/types/index.ts`

- [ ] **Step 1: Read existing types**

Run: `cat src/lib/types/index.ts`

- [ ] **Step 2: Add new types for React Query**

```typescript
// Add to existing types

export interface Quote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
}

export interface Author {
  _id: string;
  name: string;
  slug: string;
  bio?: string;
  quoteCount: number;
}

export interface Reaction {
  quoteId: string;
  type: 'liked' | 'disliked';
  timestamp: number;
  quoteSnapshot: {
    content: string;
    author: string;
    authorSlug: string;
    tags: string[];
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types/index.ts
git commit -m "types: add Quote, Author, Reaction interfaces"
```

---

## Chunk 2: React Query Setup

### Task 4: Create Quote Hooks

**Files:**
- Create: `src/hooks/useQuotes.ts`
- Test: `src/hooks/useQuotes.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/hooks/useQuotes.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRandomQuote, useSearchQuotes } from './useQuotes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRandomQuote', () => {
  it('fetches random quote', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        _id: '1',
        content: 'Test quote',
        author: 'Test Author',
        authorSlug: 'test-author',
        tags: ['test'],
      }),
    });

    const { result } = renderHook(() => useRandomQuote(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toBe('Test quote');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="useQuotes.test.ts" -v`
Expected: FAIL with "Cannot find module './useQuotes'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/hooks/useQuotes.ts
import { useQuery } from '@tanstack/react-query';
import type { Quote } from '@/lib/types';

async function fetchRandomQuote(): Promise<Quote> {
  const res = await fetch('https://api.quotable.io/random');
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

async function searchQuotes(query: string): Promise<{ results: Quote[] }> {
  const res = await fetch(`https://api.quotable.io/search/quotes?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search quotes');
  return res.json();
}

async function getAuthorQuotes(authorSlug: string): Promise<{ results: Quote[] }> {
  const res = await fetch(`https://api.quotable.io/quotes?author=${authorSlug}`);
  if (!res.ok) throw new Error('Failed to fetch author quotes');
  return res.json();
}

export function useRandomQuote() {
  return useQuery({
    queryKey: ['randomQuote'],
    queryFn: fetchRandomQuote,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchQuotes(query: string) {
  return useQuery({
    queryKey: ['searchQuotes', query],
    queryFn: () => searchQuotes(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuthorQuotes(authorSlug: string) {
  return useQuery({
    queryKey: ['authorQuotes', authorSlug],
    queryFn: () => getAuthorQuotes(authorSlug),
    staleTime: 5 * 60 * 1000,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="useQuotes.test.ts" -v`
Expected: PASS (may need to mock fetch)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useQuotes.ts src/hooks/useQuotes.test.ts
git commit -m "feat: add React Query hooks for quotes API"
```

---

### Task 5: Add QueryProvider

**Files:**
- Create: `src/components/providers/QueryProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create QueryProvider component**

```typescript
// src/components/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Update layout.tsx to include provider**

```typescript
// In src/app/layout.tsx, add import:
import { QueryProvider } from '@/components/providers/QueryProvider';

// Wrap children:
<QueryProvider>
  <ThemeProvider>
    <ToastProvider>
      <QuotesProvider>
        {children}
      </QuotesProvider>
    </ToastProvider>
  </ThemeProvider>
</QueryProvider>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/providers/QueryProvider.tsx src/app/layout.tsx
git commit -m "feat: add QueryProvider for React Query"
```

---

## Chunk 3: UI Components

### Task 6: Create QuoteDisplay Component

**Files:**
- Create: `src/components/ui/QuoteDisplay.tsx`
- Test: `src/components/ui/QuoteDisplay.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/QuoteDisplay.test.tsx
import { render, screen } from '@testing-library/react';
import { QuoteDisplay } from './QuoteDisplay';

describe('QuoteDisplay', () => {
  it('renders quote content', () => {
    render(
      <QuoteDisplay
        content="Test quote"
        author="Test Author"
        authorSlug="test-author"
        tags={['test']}
      />
    );
    expect(screen.getByText('Test quote')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="QuoteDisplay.test.tsx" -v`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/QuoteDisplay.tsx
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
      <blockquote className="font-serif text-3xl md:text-4xl leading-relaxed text-[var(--text-primary)] mb-8">
        "{content}"
      </blockquote>
      <figcaption className="flex flex-col items-center gap-4">
        <Link
          href={`/author/${authorSlug}`}
          className="text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          — {author}
        </Link>
        <div className="flex gap-2 flex-wrap justify-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
        {onReaction && (
          <button
            onClick={() => onReaction(reaction === 'liked' ? 'disliked' : 'liked')}
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label={reaction === 'liked' ? 'Unlike' : 'Like'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-transform hover:scale-110',
                reaction === 'liked' ? 'fill-red-500 text-red-500' : 'text-[var(--text-secondary)]'
              )}
            />
          </button>
        )}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="QuoteDisplay.test.tsx" -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/QuoteDisplay.tsx src/components/ui/QuoteDisplay.test.tsx
git commit -m "feat: add QuoteDisplay component"
```

---

### Task 7: Create MinimalHeader Component

**Files:**
- Create: `src/components/ui/MinimalHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/ui/MinimalHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/likes', label: 'Favorites' },
];

export function MinimalHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--divider)]">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-[var(--text-primary)]"
        >
          VibeQuotes
        </Link>
        <ul className="flex gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-sm uppercase tracking-widest transition-colors',
                  pathname === link.href
                    ? 'text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/MinimalHeader.tsx
git commit -f "feat: add MinimalHeader component"
```

---

### Task 8: Create SearchBar Component

**Files:**
- Create: `src/components/ui/SearchBar.tsx`
- Test: `src/components/ui/SearchBar.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/ui/SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onSearch after debounce', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    fireEvent.change(screen.getByPlaceholderText('Search quotes or authors...'), {
      target: { value: 'test' },
    });
    
    vi.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('test');
    });
    
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern="SearchBar.test.tsx" -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/ui/SearchBar.tsx
'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search quotes or authors...',
  className,
  defaultValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 py-2 bg-transparent border-b border-[var(--divider)] focus:border-[var(--accent)] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-colors"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern="SearchBar.test.tsx" -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SearchBar.tsx
git commit -m "feat: add SearchBar component"
```

Then commit test separately:
```bash
git add src/components/ui/SearchBar.test.tsx
git commit -m "test: add SearchBar tests"
```

---

### Task 9: Create TagPill Component

**Files:**
- Create: `src/components/ui/TagPill.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/components/ui/TagPill.tsx
import { cn } from '@/lib/utils/cn';

interface TagPillProps {
  tag: string;
  onClick?: () => void;
  className?: string;
}

export function TagPill({ tag, onClick, className }: TagPillProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-block text-xs px-3 py-1 rounded-full',
        'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
        onClick && 'hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer',
        className
      )}
    >
      {tag}
    </Component>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/TagPill.tsx
git commit -m "feat: add TagPill component"
```

---

## Chunk 4: Update Pages

### Task 10: Update Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Read current page.tsx**

Run: `cat src/app/page.tsx`

- [ ] **Step 2: Rewrite with new components**

```tsx
// src/app/page.tsx
'use client';

import { useRandomQuote } from '@/hooks/useQuotes';
import { QuoteDisplay } from '@/components/ui/QuoteDisplay';
import { useQuotes } from '@/context/QuotesContext';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data: quote, isLoading, error, refetch } = useRandomQuote();
  const { getReaction, toggleReaction } = useQuotes();

  const handleReaction = (type: 'liked' | 'disliked') => {
    if (quote) {
      toggleReaction(quote._id, type, {
        content: quote.content,
        author: quote.author,
        authorSlug: quote.authorSlug,
        tags: quote.tags,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-secondary)]" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-[var(--text-secondary)]">Failed to load quote</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  const reaction = getReaction(quote._id);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <QuoteDisplay
        content={quote.content}
        author={quote.author}
        authorSlug={quote.authorSlug}
        tags={quote.tags}
        reaction={reaction?.type}
        onReaction={handleReaction}
      />
      
      <button
        onClick={() => refetch()}
        className="mt-12 text-sm uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        New Quote
      </button>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update home page with minimalist design"
```

---

### Task 11: Update Search Page

**Files:**
- Modify: `src/app/search/page.tsx`

- [ ] **Step 1: Read current search page**

Run: `cat src/app/search/page.tsx`

- [ ] **Step 2: Rewrite with new components**

```tsx
// src/app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSearchQuotes } from '@/hooks/useQuotes';
import { SearchBar } from '@/components/ui/SearchBar';
import { QuoteDisplay } from '@/components/ui/QuoteDisplay';
import { useQuotes } from '@/context/QuotesContext';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { data, isLoading, error } = useSearchQuotes(query);
  const { getReaction, toggleReaction } = useQuotes();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [query, router]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleReaction = (quoteId: string, type: 'liked' | 'disliked', quoteData: any) => {
    toggleReaction(quoteId, type, quoteData);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Search</h1>
      
      <SearchBar
        onSearch={handleSearch}
        defaultValue={initialQuery}
        className="mb-12"
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--text-secondary)]" />
        </div>
      )}

      {error && (
        <p className="text-center text-[var(--text-secondary)] py-12">
          Failed to search quotes. Please try again.
        </p>
      )}

      {data?.results && data.results.length === 0 && query && (
        <p className="text-center text-[var(--text-secondary)] py-12">
          No quotes found for "{query}"
        </p>
      )}

      <div className="space-y-16">
        {data?.results?.map((quote) => {
          const reaction = getReaction(quote._id);
          return (
            <QuoteDisplay
              key={quote._id}
              content={quote.content}
              author={quote.author}
              authorSlug={quote.authorSlug}
              tags={quote.tags}
              reaction={reaction?.type}
              onReaction={(type) => handleReaction(quote._id, type, {
                content: quote.content,
                author: quote.author,
                authorSlug: quote.authorSlug,
                tags: quote.tags,
              })}
            />
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/search/page.tsx
git commit -m "feat: update search page with minimalist design"
```

---

### Task 12: Update Author Page

**Files:**
- Modify: `src/app/author/[slug]/page.tsx`

- [ ] **Step 1: Read current author page**

Run: `cat src/app/author/[slug]/page.tsx`

- [ ] **Step 2: Rewrite with new components**

```tsx
// src/app/author/[slug]/page.tsx
'use client';

import React from 'react';
import { useAuthorQuotes } from '@/hooks/useQuotes';
import { QuoteDisplay } from '@/components/ui/QuoteDisplay';
import { useQuotes } from '@/context/QuotesContext';
import { Loader2 } from 'lucide-react';

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = React.use(params);
  const { data, isLoading, error } = useAuthorQuotes(resolvedParams.slug);
  const { getReaction, toggleReaction } = useQuotes();

  const handleReaction = (quoteId: string, type: 'liked' | 'disliked', quoteData: any) => {
    toggleReaction(quoteId, type, quoteData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--text-secondary)]" />
      </div>
    );
  }

  if (error || !data?.results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-[var(--text-secondary)]">Author not found</p>
      </div>
    );
  }

  const authorName = data.results[0]?.author || resolvedParams.slug;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-16 text-center">
        <h1 className="font-serif text-4xl text-[var(--text-primary)] mb-4">
          {authorName}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {data.results.length} quote{data.results.length !== 1 ? 's' : ''}
        </p>
      </header>

      <div className="space-y-16">
        {data.results.map((quote) => {
          const reaction = getReaction(quote._id);
          return (
            <QuoteDisplay
              key={quote._id}
              content={quote.content}
              author={quote.author}
              authorSlug={quote.authorSlug}
              tags={quote.tags}
              reaction={reaction?.type}
              onReaction={(type) => handleReaction(quote._id, type, {
                content: quote.content,
                author: quote.author,
                authorSlug: quote.authorSlug,
                tags: quote.tags,
              })}
            />
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/author/[slug]/page.tsx
git commit -m "feat: update author page with minimalist design"
```

---

### Task 13: Update Likes Page

**Files:**
- Modify: `src/app/likes/page.tsx`

- [ ] **Step 1: Read current likes page**

Run: `cat src/app/likes/page.tsx`

- [ ] **Step 2: Rewrite with new components**

```tsx
// src/app/likes/page.tsx
'use client';

import { useState } from 'react';
import { useQuotes } from '@/context/QuotesContext';
import { QuoteDisplay } from '@/components/ui/QuoteDisplay';
import { cn } from '@/lib/utils/cn';

type FilterType = 'all' | 'liked' | 'disliked';

export default function LikesPage() {
  const { reactions, toggleReaction } = useQuotes();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredReactions = reactions.filter((r) => {
    if (filter === 'all') return true;
    return r.type === filter;
  });

  const handleReaction = (quoteId: string, type: 'liked' | 'disliked', quoteData: any) => {
    toggleReaction(quoteId, type, quoteData);
  };

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'liked', label: 'Liked' },
    { value: 'disliked', label: 'Disliked' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl text-[var(--text-primary)] mb-8">Favorites</h1>

      <div className="flex gap-4 mb-12 border-b border-[var(--divider)]">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'pb-3 text-sm uppercase tracking-widest transition-colors -mb-px',
              filter === f.value
                ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredReactions.length === 0 && (
        <p className="text-center text-[var(--text-secondary)] py-12">
          {filter === 'all'
            ? 'No favorites yet. Start liking quotes!'
            : `No ${filter} quotes yet.`}
        </p>
      )}

      <div className="space-y-16">
        {filteredReactions.map((reaction) => (
          <QuoteDisplay
            key={reaction.quoteId}
            content={reaction.quoteSnapshot.content}
            author={reaction.quoteSnapshot.author}
            authorSlug={reaction.quoteSnapshot.authorSlug}
            tags={reaction.quoteSnapshot.tags}
            reaction={reaction.type}
            onReaction={(type) =>
              handleReaction(
                reaction.quoteId,
                type,
                reaction.quoteSnapshot
              )
            }
          />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/likes/page.tsx
git commit -m "feat: update likes page with minimalist design"
```

---

### Task 13b: Create Toast Component

**Files:**
- Create: `src/components/ui/Toast.tsx`

- [ ] **Step 1: Create Toast component**

```tsx
// src/components/ui/Toast.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg',
        colors[toast.type]
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Toast.tsx
git commit -m "feat: add Toast component for notifications"
```

---

### Task 13c: Create Toast Context

**Files:**
- Create: `src/context/ToastContext.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create ToastContext**

```tsx
// src/context/ToastContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from '@/components/ui/Toast';

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
```

- [ ] **Step 2: Update layout to include ToastContainer**

```tsx
// In layout.tsx, add:
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/context/ToastContext';

// Add before closing body:
function ToastManager() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onDismiss={removeToast} />;
}

// Add <ToastManager /> in the layout
```

- [ ] **Step 3: Commit**

```bash
git add src/context/ToastContext.tsx src/app/layout.tsx
git commit -m "feat: add ToastContext for notifications"
```

---

### Task 13d: Update Footer Component

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Simplify Footer for minimal design**

```tsx
// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--divider)]">
      <p>Press <kbd className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded text-xs">R</kbd> for random quote</p>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "style: simplify footer for minimalist design"
```

---

## Chunk 5: Styling & Theme

### Task 14: Update Global Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add CSS variables for theming**

```css
@theme {
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  
  --color-bg-primary: #FAFAFA;
  --color-bg-secondary: #FFFFFF;
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #6B6B6B;
  --color-accent: #2563EB;
  --color-divider: #E5E5E5;
}

:root {
  --bg-primary: var(--color-bg-primary);
  --bg-secondary: var(--color-bg-secondary);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --accent: var(--color-accent);
  --divider: var(--color-divider);
}

.dark {
  --bg-primary: #0A0A0A;
  --bg-secondary: #141414;
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1A1;
  --divider: #262626;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

- [ ] **Step 2: Add font imports (in layout.tsx or globals.css)**

Add to `src/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add CSS variables for theming"
```

---

### Task 15: Update Header in Layout

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: `src/components/layout/Header.tsx` (old component, no longer needed)

- [ ] **Step 1: Remove old Header import and replace with MinimalHeader**

In `src/app/layout.tsx`:
1. Remove import: `import { Header } from '@/components/layout/Header'`
2. Remove `<Header />` component usage
3. Add import: `import { MinimalHeader } from '@/components/ui/MinimalHeader'`
4. Add `<MinimalHeader />` component in the layout

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git rm src/components/layout/Header.tsx
git commit -m "feat: replace Header with MinimalHeader"

---

## Chunk 6: Quality Improvements

### Task 16: Add Error Boundary

**Files:**
- Create: `src/components/error-boundary/ErrorBoundary.tsx`
- Modify: `src/app/error.tsx`

- [ ] **Step 1: Create ErrorBoundary component**

```tsx
// src/components/error-boundary/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
            <h2 className="text-2xl font-serif text-[var(--text-primary)]">
              Something went wrong
            </h2>
            <p className="text-[var(--text-secondary)]">
              Please try refreshing the page
            </p>
            <Button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

- [ ] **Step 2: Create Button component (minimal)**

```tsx
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 bg-[var(--accent)] text-white rounded-lg',
        'hover:opacity-90 transition-opacity',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Update error.tsx**

```tsx
// src/app/error.tsx
'use client';

import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
      <h2 className="text-2xl font-serif text-[var(--text-primary)]">
        Something went wrong
      </h2>
      <p className="text-[var(--text-secondary)]">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/error-boundary/ErrorBoundary.tsx src/components/ui/Button.tsx src/app/error.tsx
git commit -m "feat: add error boundary component"
```

---

### Task 17: Add Toast Context

**Files:**
- Modify: `src/app/layout.tsx` or create `src/components/ui/KeyboardShortcuts.tsx`

- [ ] **Step 1: Update KeyboardShortcuts component**

```tsx
// src/components/ui/KeyboardShortcuts.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'r':
          router.push('/');
          break;
        case '/':
          e.preventDefault();
          router.push('/search');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null;
}
```

- [ ] **Step 2: Add to layout**

```tsx
// In layout.tsx, add import and component
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts';

// Add before closing body
<KeyboardShortcuts />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/KeyboardShortcuts.tsx src/app/layout.tsx
git commit -m "feat: add keyboard shortcuts"
```

---

### Task 18: Add SEO Meta Tags

**Files:**
- Create: `src/components/seo/Metadata.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/search/page.tsx`
- Modify: `src/app/author/[slug]/page.tsx`
- Modify: `src/app/likes/page.tsx`

- [ ] **Step 1: Create metadata utilities**

```tsx
// src/components/seo/Metadata.tsx
import { Quote } from '@/lib/types';

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
}

export function generateHomeMetadata(): PageMetadata {
  return {
    title: 'VibeQuotes - Discover Inspirational Quotes',
    description: 'Discover inspiring quotes from great minds throughout history. Search, save, and share your favorites.',
  };
}

export function generateSearchMetadata(query: string): PageMetadata {
  return {
    title: `Search: ${query} - VibeQuotes`,
    description: `Search results for "${query}" on VibeQuotes`,
  };
}

export function generateAuthorMetadata(author: string, count: number): PageMetadata {
  return {
    title: `${author} - VibeQuotes`,
    description: `Explore ${count} quotes from ${author}`,
  };
}

export function generateQuoteJsonLd(quote: Quote) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quote',
    text: quote.content,
    author: {
      '@type': 'Person',
      name: quote.author,
    },
    keywords: quote.tags.join(', '),
  };
}
```

- [ ] **Step 2: Add dynamic metadata to pages**

In each page file, export metadata:
```tsx
// src/app/page.tsx - add at top level
import { generateHomeMetadata } from '@/components/seo/Metadata';

export const metadata = generateHomeMetadata;
```

- [ ] **Step 3: Add JSON-LD to QuoteDisplay**

In `QuoteDisplay.tsx`, add script tag for structured data:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateQuoteJsonLd(quote)),
  }}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/ src/app/
git commit -m "feat: add SEO meta tags and structured data"
```

---

### Task 19: Add Link Prefetching

**Files:**
- Modify: `src/components/ui/QuoteDisplay.tsx`

- [ ] **Step 1: Add prefetch on hover to author link**

```tsx
// In QuoteDisplay.tsx, update the Link component:
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Inside component:
const router = useRouter();

<Link
  href={`/author/${authorSlug}`}
  onMouseEnter={() => router.prefetch(`/author/${authorSlug}`)}
  // ... rest of props
>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/QuoteDisplay.tsx
git commit -m "feat: add link prefetching on hover"
```

---

## Chunk 7: Animations & Polish

### Task 22: Add Page Transitions

**Files:**
- Create: `src/components/ui/PageTransition.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create PageTransition component**

```tsx
// src/components/ui/PageTransition.tsx
'use client';

import { motion, type MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps extends MotionProps {
  children: ReactNode;
}

export function PageTransition({ children, ...props }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add reduced motion support**

```tsx
// Update PageTransition to respect prefers-reduced-motion
import { useReducedMotion } from 'framer-motion';

export function PageTransition({ children, ...props }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Wrap page content**

```tsx
// In layout.tsx, wrap children with PageTransition
import { PageTransition } from '@/components/ui/PageTransition';

<PageTransition>
  {children}
</PageTransition>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/PageTransition.tsx src/app/layout.tsx
git commit -m "feat: add page transitions with reduced motion support"
```

---

## Chunk 8: Testing

### Task 20: Run Tests and Fix Issues

**Files:**
- Run tests across the project

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: Review output for failures

- [ ] **Step 2: Fix any failing tests**

Address issues as they arise

- [ ] **Step 3: Commit fixes**

```bash
git add .
git commit -m "test: fix failing tests"
```

---

### Task 21: Run Lint and Typecheck

**Files:**
- Run linting and type checking

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Fix any issues**

Address lint/type errors

- [ ] **Step 4: Commit fixes**

```bash
git add .
git commit -m "chore: fix lint and type errors"
```

---

### Task 22: Add Integration Tests

**Files:**
- Create: `__tests__/integration/search-flow.test.tsx`
- Create: `__tests__/integration/favorites-flow.test.tsx`

- [ ] **Step 1: Write search integration test**

```tsx
// __tests__/integration/search-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from '@/app/search/page';

describe('Search Flow', () => {
  it('searches and displays results', async () => {
    // Mock API response
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        results: [
          {
            _id: '1',
            content: 'Test quote',
            author: 'Test Author',
            authorSlug: 'test-author',
            tags: ['test'],
          },
        ],
      }),
    });

    render(<SearchPage />);
    
    const input = screen.getByPlaceholderText('Search quotes or authors...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.getByText('Test quote')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Write favorites integration test**

```tsx
// __tests__/integration/favorites-flow.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LikesPage from '@/app/likes/page';
import { QuotesProvider } from '@/context/QuotesContext';

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<QuotesProvider>{ui}</QuotesProvider>);
};

describe('Favorites Flow', () => {
  it('displays liked quotes', () => {
    // Pre-populate localStorage with test data
    localStorage.setItem('quotes-reactions', JSON.stringify([
      {
        quoteId: '1',
        type: 'liked',
        timestamp: Date.now(),
        quoteSnapshot: {
          content: 'Test quote',
          author: 'Test Author',
          authorSlug: 'test-author',
          tags: ['test'],
        },
      },
    ]));

    renderWithProviders(<LikesPage />);
    
    expect(screen.getByText('Test quote')).toBeInTheDocument();
    expect(screen.getByText('Liked')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run integration tests**

Run: `npm test -- --testPathPattern="integration"`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add __tests__/integration/
git commit -m "test: add integration tests for search and favorites"
```

---

## Final: Build and Verify

### Task 23: Build Project

**Files:**
- Build the project

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Build completes successfully

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "chore: build passes successfully"
```

---

**Plan complete and saved to `docs/superpowers/plans/2026-03-11-vibequotes-quality-ui-redesign.md`. Ready to execute?**
