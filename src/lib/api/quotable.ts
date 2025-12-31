import { Quote, Author, PaginatedQuotes, PaginatedAuthors, SearchParams } from "@/lib/types";

const BASE_URL = "https://api.quotable.io";


//json{authorName: "Albert Einstein", slug: "albert-einstein" },


// Custom error class for API errors
export class QuotableError extends Error {
  constructor(
    message: string,
    public syyytatus?: number,
    public isOffline?: boolean
  ) {
    super(message);
    this.name = "QuotableError";
  }
}

// Helper to handle fetch with error handling
async function fetchWithError<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new QuotableError(
        `API error: ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof QuotableError) throw error;
    
    // Handle network errors (offline)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new QuotableError("You appear to be offline", undefined, true);
    }
    
    throw new QuotableError("Failed to fetch data");
  }
}

// Get a random quote
export async function getRandomQuote(tags?: string): Promise<Quote> {
  const params = new URLSearchParams();
  if (tags) params.set("tags", tags);
  
  const url = `${BASE_URL}/quotes/random${params.toString() ? `?${params}` : ""}`;
  const quotes = await fetchWithError<Quote[]>(url, { cache: "no-store" });
  return quotes[0];
}

// Get multiple random quotes for suggestions
export async function getRandomQuotes(limit: number = 3, tags?: string): Promise<Quote[]> {
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  if (tags) params.set("tags", tags);
  
  const url = `${BASE_URL}/quotes/random?${params}`;
  return fetchWithError<Quote[]>(url, { cache: "no-store" });
}

// Search quotes by text or filter by author
export async function searchQuotes(params: SearchParams): Promise<PaginatedQuotes> {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.set("query", params.query);
  if (params.author) searchParams.set("author", params.author);
  if (params.tags) searchParams.set("tags", params.tags);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  
  // Use search endpoint if there's a query, otherwise use quotes endpoint
  const endpoint = params.query ? "/search/quotes" : "/quotes";
  const url = `${BASE_URL}${endpoint}?${searchParams}`;
  
  return fetchWithError<PaginatedQuotes>(url, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });
}

// Get quotes by author slug
export async function getQuotesByAuthor(
  authorSlug: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedQuotes> {
  const params = new URLSearchParams({
    author: authorSlug,
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const url = `${BASE_URL}/quotes?${params}`;
  return fetchWithError<PaginatedQuotes>(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
}

// Get author details by slug
export async function getAuthor(slug: string): Promise<Author | null> {
  const url = `${BASE_URL}/authors?slug=${slug}`;
  const response = await fetchWithError<PaginatedAuthors>(url, {
    next: { revalidate: 3600 },
  });
  
  return response.results[0] || null;
}

// Search authors
export async function searchAuthors(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedAuthors> {
  const params = new URLSearchParams({
    name: query,
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const url = `${BASE_URL}/search/authors?${params}`;
  return fetchWithError<PaginatedAuthors>(url, {
    next: { revalidate: 60 },
  });
}

// Get all available tags
export async function getTags(): Promise<{ _id: string; name: string; quoteCount: number }[]> {
  const url = `${BASE_URL}/tags`;
  const response = await fetchWithError<{ count: number; results: { _id: string; name: string; quoteCount: number }[] }>(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });
  return response.results;
}

// Popular authors to suggest when no results found
export const POPULAR_AUTHORS = [
  { name: "Albert Einstein", slug: "albert-einstein" },
  { name: "Winston Churchill", slug: "winston-churchill" },
  { name: "Mark Twain", slug: "mark-twain" },
  { name: "Oscar Wilde", slug: "oscar-wilde" },
  { name: "Mahatma Gandhi", slug: "mahatma-gandhi" },
  { name: "Benjamin Franklin", slug: "benjamin-franklin" },
  { name: "Nelson Mandela", slug: "nelson-mandela" },
  { name: "Maya Angelou", slug: "maya-angelou" },
];
