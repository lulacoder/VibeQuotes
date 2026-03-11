"use client";

import { useRandomQuote } from "@/hooks/useQuotes";
import { QuoteDisplay } from "@/components/ui/QuoteDisplay";
import { useQuotes } from "@/context/QuotesContext";
import { Loader2 } from "lucide-react";
import { Quote } from "@/lib/types";

export default function HomePage() {
  const { data: quote, isLoading, error, refetch } = useRandomQuote();
  const { getReaction, addLike, addDislike } = useQuotes();

  const handleReaction = (type: "liked" | "disliked") => {
    if (quote) {
      const quoteData: Quote = {
        _id: quote._id,
        content: quote.content,
        author: quote.author,
        authorSlug: quote.authorSlug,
        length: quote.length,
        tags: quote.tags,
      };
      if (type === "liked") {
        addLike(quoteData);
      } else {
        addDislike(quoteData);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-var(--text-secondary)" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-var(--text-secondary)">Failed to load quote</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-var(--accent) text-white rounded-lg hover:opacity-90 transition-opacity"
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
        className="mt-12 text-sm uppercase tracking-widest text-var(--text-secondary) hover:text-var(--text-primary) transition-colors"
      >
        New Quote
      </button>
    </main>
  );
}
