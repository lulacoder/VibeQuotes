import { useQuery } from '@tanstack/react-query';
import { getUnifiedRandomQuote, searchUnifiedQuotes, getQuotesByAuthorSlug } from '@/lib/api/quotes';
import type { Quote, AuthorCategory, QuoteEra } from '@/lib/types';

export function useRandomQuote(era?: QuoteEra | "all", category?: AuthorCategory) {
  return useQuery({
    queryKey: ['randomQuote', era, category],
    queryFn: () => getUnifiedRandomQuote(era, category),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchQuotes(query: string) {
  return useQuery({
    queryKey: ['searchQuotes', query],
    queryFn: () => searchUnifiedQuotes(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAuthorQuotes(authorSlug: string) {
  return useQuery({
    queryKey: ['authorQuotes', authorSlug],
    queryFn: () => getQuotesByAuthorSlug(authorSlug),
    staleTime: 5 * 60 * 1000,
  });
}
