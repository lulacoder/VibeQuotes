import quoteLibrary from "@/data/quote-library.json";
import { modernQuotes, MODERN_AUTHORS, getRandomModernQuote, getRandomModernQuotes, getQuotesByAuthor as getModernQuotesByAuthor, getQuotesByCategory as getModernQuotesByCategory, searchModernQuotes } from "@/data/modern-quotes";
import type { AuthorCategory, PaginatedQuotes, Quote, QuoteEra, QuoteSource, ModernQuote } from "@/lib/types";

type LibraryAuthor = {
  name: string;
  slug: string;
  category: AuthorCategory;
  bio: string;
};

type LibraryQuote = {
  id: string;
  content: string;
  author: string;
  authorSlug: string;
  category: AuthorCategory;
  era: QuoteEra;
  tags: string[];
  source: string;
};

type QuoteLibrary = {
  authors: Array<Pick<LibraryAuthor, "name" | "slug" | "category" | "bio">>;
  quotes: LibraryQuote[];
};

const library = quoteLibrary as QuoteLibrary;

export const AUTHOR_CATEGORIES: { value: AuthorCategory; label: string; icon: string }[] = [
  { value: "entrepreneur", label: "Entrepreneurs", icon: "💼" },
  { value: "philosopher", label: "Philosophers", icon: "🧠" },
  { value: "athlete", label: "Athletes", icon: "🏆" },
  { value: "artist", label: "Artists", icon: "🎨" },
  { value: "scientist", label: "Scientists", icon: "🔬" },
  { value: "leader", label: "Leaders", icon: "👑" },
];

export const ERA_OPTIONS: { value: QuoteEra | "all"; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
];

function modernToQuote(mq: ModernQuote): Quote {
  return {
    _id: mq.id,
    content: mq.content,
    author: mq.author,
    authorSlug: mq.authorSlug,
    length: mq.content.length,
    tags: mq.tags,
    source: "local",
    era: mq.era,
    category: mq.category,
  };
}

function localToQuote(item: LibraryQuote): Quote {
  return {
    _id: item.id,
    content: item.content,
    author: item.author,
    authorSlug: item.authorSlug,
    length: item.content.length,
    tags: item.tags,
    source: "local",
    era: item.era,
    category: item.category,
  };
}

function getAllQuotes(): Quote[] {
  return [
    ...library.quotes.map(localToQuote),
    ...modernQuotes.map(modernToQuote),
  ];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function paginate(items: Quote[], page = 1, limit = 10): PaginatedQuotes {
  const startIndex = (page - 1) * limit;
  const results = items.slice(startIndex, startIndex + limit);

  return {
    count: results.length,
    totalCount: items.length,
    page,
    totalPages: Math.ceil(items.length / limit),
    lastItemIndex: results.length ? startIndex + results.length - 1 : null,
    results,
  };
}

export function getAllAuthors() {
  return [
    ...library.authors,
    ...Object.values(MODERN_AUTHORS),
  ];
}

export function getAllModernAuthors() {
  return Object.values(MODERN_AUTHORS);
}

export function getQuotesByCategory(category: AuthorCategory): Quote[] {
  return getAllQuotes().filter((quote) => quote.category === category);
}

export async function getUnifiedRandomQuote(
  era?: QuoteEra | "all",
  category?: AuthorCategory
): Promise<Quote> {
  const pool = getAllQuotes().filter((quote) => {
    const eraMatch = !era || era === "all" || quote.era === era;
    const categoryMatch = !category || quote.category === category;
    return eraMatch && categoryMatch;
  });

  return shuffle(pool)[0] ?? localToQuote(library.quotes[0]);
}

export async function getUnifiedRandomQuotes(
  count = 3,
  era?: QuoteEra | "all",
  category?: AuthorCategory
): Promise<Quote[]> {
  const pool = getAllQuotes().filter((quote) => {
    const eraMatch = !era || era === "all" || quote.era === era;
    const categoryMatch = !category || quote.category === category;
    return eraMatch && categoryMatch;
  });

  return shuffle(pool).slice(0, count);
}

export async function searchUnifiedQuotes(
  query: string,
  era?: QuoteEra | "all",
  category?: AuthorCategory,
  page = 1,
  limit = 10
): Promise<PaginatedQuotes> {
  const lowerQuery = query.toLowerCase();
  const modernMatches = searchModernQuotes(query).map(modernToQuote);
  const classicMatches = library.quotes
    .filter((quote) =>
      quote.content.toLowerCase().includes(lowerQuery) ||
      quote.author.toLowerCase().includes(lowerQuery) ||
      quote.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
    .map(localToQuote);

  const results = shuffle([...modernMatches, ...classicMatches]).filter((quote) => {
    const eraMatch = !era || era === "all" || quote.era === era;
    const categoryMatch = !category || quote.category === category;
    return eraMatch && categoryMatch;
  });

  return paginate(results, page, limit);
}

export async function getQuotesByAuthorSlug(
  authorSlug: string,
  page = 1,
  limit = 10
): Promise<PaginatedQuotes> {
  const modernAuthorQuotes = getModernQuotesByAuthor(authorSlug).map(modernToQuote);
  const localAuthorQuotes = library.quotes
    .filter((quote) => quote.authorSlug === authorSlug)
    .map(localToQuote);

  return paginate(shuffle([...modernAuthorQuotes, ...localAuthorQuotes]), page, limit);
}

export function getAuthorBySlug(authorSlug: string) {
  return getAllAuthors().find((author) => author.slug === authorSlug) ?? null;
}

export function getQuotesByAuthor(authorSlug: string): Quote[] {
  return [
    ...getModernQuotesByAuthor(authorSlug).map(modernToQuote),
    ...library.quotes.filter((quote) => quote.authorSlug === authorSlug).map(localToQuote),
  ];
}

export function getFeaturedQuoteRail() {
  return shuffle(getAllQuotes()).slice(0, 12);
}
