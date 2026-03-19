// Quote Source Types
export type QuoteSource = "local";
export type QuoteEra = "modern" | "classic";
export type AuthorCategory = "entrepreneur" | "philosopher" | "athlete" | "artist" | "scientist" | "leader";

// Quotable API Types
export interface Quote {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  tags: string[];
  dateAdded?: string;
  dateModified?: string;
  source?: QuoteSource;
  era?: QuoteEra;
  category?: AuthorCategory;
}

// Modern Quote Type (for local quotes)
export interface ModernQuote {
  id: string;
  content: string;
  author: string;
  authorSlug: string;
  category: AuthorCategory;
  era: QuoteEra;
  tags: string[];
  source: string;
  length?: number;
}

// Modern Author Info
export interface ModernAuthor {
  name: string;
  slug: string;
  category: AuthorCategory;
  bio: string;
  era: QuoteEra;
}

export interface Author {
  _id: string;
  bio: string;
  description: string;
  link: string;
  name: string;
  slug: string;
  quoteCount: number;
  dateAdded?: string;
  dateModified?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  totalCount: number;
  page: number;
  totalPages: number;
  lastItemIndex: number | null;
  results: T[];
}

export type PaginatedQuotes = PaginatedResponse<Quote>;
export type PaginatedAuthors = PaginatedResponse<Author>;

// User Reaction Types
export interface QuoteSnapshot {
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
}

export interface Reaction {
  quoteId: string;
  type: "liked" | "disliked";
  timestamp: number;
  quoteSnapshot: QuoteSnapshot;
}

// Context State Types
export interface QuotesState {
  reactions: Record<string, Reaction>;
  hydrated: boolean;
}

export type QuotesAction =
  | { type: "ADD_LIKE"; payload: { quote: Quote } }
  | { type: "ADD_DISLIKE"; payload: { quote: Quote } }
  | { type: "REMOVE_REACTION"; payload: { quoteId: string } }
  | { type: "HYDRATE_FROM_STORAGE"; payload: Record<string, Reaction> };

// Search Types
export interface SearchParams {
  query?: string;
  author?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

// Toast Types
export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
