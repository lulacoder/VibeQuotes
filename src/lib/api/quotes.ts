import { Quote, ModernQuote, AuthorCategory, QuoteEra, PaginatedQuotes } from "@/lib/types";
import { getRandomQuote as getQuotableRandom, getRandomQuotes as getQuotableRandoms, searchQuotes as searchQuotable } from "./quotable";
import { modernQuotes, MODERN_AUTHORS, getRandomModernQuote, getRandomModernQuotes, searchModernQuotes, getQuotesByCategory as getModernByCategory, getQuotesByAuthor as getModernByAuthor } from "@/data/modern-quotes";

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

export { MODERN_AUTHORS };

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
  { value: "modern", label: "Modern (2020s)" },
  { value: "classic", label: "Classic" },
];

export async function getUnifiedRandomQuote(
  era?: QuoteEra | "all",
  category?: AuthorCategory,
  preferModern: boolean = false
): Promise<Quote> {
  if (era === "modern") {
    const modernQuotes = category 
      ? getModernByCategory(category) 
      : undefined;
    if (modernQuotes && modernQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * modernQuotes.length);
      return modernToQuote(modernQuotes[randomIndex]);
    }
    return modernToQuote(getRandomModernQuote());
  }

  if (era === "classic") {
    try {
      const quote = await getQuotableRandom();
      return { ...quote, source: "quotable", era: "classic" };
    } catch {
      return modernToQuote(getRandomModernQuote());
    }
  }

  if (preferModern && Math.random() > 0.5) {
    const modernQuotes = category 
      ? getModernByCategory(category) 
      : undefined;
    if (modernQuotes && modernQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * modernQuotes.length);
      return modernToQuote(modernQuotes[randomIndex]);
    }
    return modernToQuote(getRandomModernQuote());
  }

  try {
    if (Math.random() > 0.6) {
      const quote = await getQuotableRandom();
      return { ...quote, source: "quotable", era: "classic" };
    }
  } catch {
    // Fall through to modern quote
  }

  return modernToQuote(getRandomModernQuote());
}

export async function getUnifiedRandomQuotes(
  count: number = 3,
  era?: QuoteEra | "all",
  category?: AuthorCategory
): Promise<Quote[]> {
  if (era === "modern") {
    const modernQuotes = category 
      ? getModernByCategory(category) 
      : undefined;
    if (modernQuotes && modernQuotes.length > 0) {
      const shuffled = [...modernQuotes].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count).map(modernToQuote);
    }
    return getRandomModernQuotes(count).map(modernToQuote);
  }

  if (era === "classic") {
    try {
      const quotableQuotes = await getQuotableRandoms(count);
      return quotableQuotes.map((q) => ({ ...q, source: "quotable" as const, era: "classic" as QuoteEra }));
    } catch {
      return getRandomModernQuotes(count).map(modernToQuote);
    }
  }

  const modernSet = getRandomModernQuotes(count).map(modernToQuote);
  
  try {
    const quotableSet = await getQuotableRandoms(count);
    const combined = [
      ...quotableSet.map((q) => ({ ...q, source: "quotable" as const, era: "classic" as QuoteEra })),
      ...modernSet
    ];
    return combined.sort(() => Math.random() - 0.5).slice(0, count);
  } catch {
    return modernSet;
  }
}

export async function searchUnifiedQuotes(
  query: string,
  era?: QuoteEra | "all",
  category?: AuthorCategory,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedQuotes> {
  const results: Quote[] = [];

  if (era !== "classic") {
    const modernResults = searchModernQuotes(query);
    const filtered = category 
      ? modernResults.filter((q) => q.category === category)
      : modernResults;
    results.push(...filtered.map(modernToQuote));
  }

  if (era !== "modern") {
    try {
      const quotableResults = await searchQuotable({ query, page, limit });
      results.push(
        ...quotableResults.results.map((q) => ({ 
          ...q, 
          source: "quotable" as const, 
          era: "classic" as QuoteEra 
        }))
      );
    } catch {
      // Quotable API might fail, continue with modern quotes only
    }
  }

  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);

  return {
    count: paginatedResults.length,
    totalCount: results.length,
    page,
    totalPages: Math.ceil(results.length / limit),
    lastItemIndex: startIndex + paginatedResults.length - 1 || null,
    results: paginatedResults,
  };
}

export async function getQuotesByAuthorSlug(
  authorSlug: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedQuotes> {
  const modernAuthorQuotes = getModernByAuthor(authorSlug);

  if (modernAuthorQuotes.length > 0) {
    const startIndex = (page - 1) * limit;
    const paginatedResults = modernAuthorQuotes.slice(startIndex, startIndex + limit);

    return {
      count: paginatedResults.length,
      totalCount: modernAuthorQuotes.length,
      page,
      totalPages: Math.ceil(modernAuthorQuotes.length / limit),
      lastItemIndex: startIndex + paginatedResults.length - 1 || null,
      results: paginatedResults.map(modernToQuote),
    };
  }

  try {
    const { getQuotesByAuthor } = await import("./quotable");
    return getQuotesByAuthor(authorSlug, page, limit);
  } catch {
    return {
      count: 0,
      totalCount: 0,
      page: 1,
      totalPages: 0,
      lastItemIndex: null,
      results: [],
    };
  }
}

export function getQuotesByCategory(category: AuthorCategory): Quote[] {
  return getModernByCategory(category).map(modernToQuote);
}

export function getAllModernAuthors() {
  return Object.values(MODERN_AUTHORS);
}
