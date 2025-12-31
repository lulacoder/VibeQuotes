"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { Quote, QuotesState, QuotesAction, Reaction } from "@/lib/types";
import { loadReactions, saveReactions } from "@/lib/utils/storage";

// Initial state
const initialState: QuotesState = {
  reactions: {},
  hydrated: false,
};

// Reducer function
function quotesReducer(state: QuotesState, action: QuotesAction): QuotesState {
  switch (action.type) {
    case "ADD_LIKE": {
      const { quote } = action.payload;
      const existingReaction = state.reactions[quote._id];
      
      // If already liked, remove the reaction (toggle off)
      if (existingReaction?.type === "liked") {
        const { [quote._id]: _, ...rest } = state.reactions;
        return { ...state, reactions: rest };
      }
      
      // Add or change to like
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [quote._id]: {
            quoteId: quote._id,
            type: "liked",
            timestamp: Date.now(),
            quoteSnapshot: {
              content: quote.content,
              author: quote.author,
              authorSlug: quote.authorSlug,
              tags: quote.tags,
            },
          },
        },
      };
    }
    
    case "ADD_DISLIKE": {
      const { quote } = action.payload;
      const existingReaction = state.reactions[quote._id];
      
      // If already disliked, remove the reaction (toggle off)
      if (existingReaction?.type === "disliked") {
        const { [quote._id]: _, ...rest } = state.reactions;
        return { ...state, reactions: rest };
      }
      
      // Add or change to dislike
      return {
        ...state,
        reactions: {
          ...state.reactions,
          [quote._id]: {
            quoteId: quote._id,
            type: "disliked",
            timestamp: Date.now(),
            quoteSnapshot: {
              content: quote.content,
              author: quote.author,
              authorSlug: quote.authorSlug,
              tags: quote.tags,
            },
          },
        },
      };
    }
    
    case "REMOVE_REACTION": {
      const { quoteId } = action.payload;
      const { [quoteId]: _, ...rest } = state.reactions;
      return { ...state, reactions: rest };
    }
    
    case "HYDRATE_FROM_STORAGE": {
      return {
        ...state,
        reactions: action.payload,
        hydrated: true,
      };
    }
    
    default:
      return state;
  }
}

// Context type
interface QuotesContextType {
  state: QuotesState;
  addLike: (quote: Quote) => void;
  addDislike: (quote: Quote) => void;
  removeReaction: (quoteId: string) => void;
  getReaction: (quoteId: string) => Reaction | undefined;
  getLikedQuotes: () => Reaction[];
  getDislikedQuotes: () => Reaction[];
  likedCount: number;
  dislikedCount: number;
}

// Create context
const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

// Provider component
export function QuotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quotesReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const reactions = loadReactions();
    dispatch({ type: "HYDRATE_FROM_STORAGE", payload: reactions });
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    if (state.hydrated) {
      saveReactions(state.reactions);
    }
  }, [state.reactions, state.hydrated]);

  // Action handlers
  const addLike = useCallback((quote: Quote) => {
    dispatch({ type: "ADD_LIKE", payload: { quote } });
  }, []);

  const addDislike = useCallback((quote: Quote) => {
    dispatch({ type: "ADD_DISLIKE", payload: { quote } });
  }, []);

  const removeReaction = useCallback((quoteId: string) => {
    dispatch({ type: "REMOVE_REACTION", payload: { quoteId } });
  }, []);

  const getReaction = useCallback(
    (quoteId: string) => state.reactions[quoteId],
    [state.reactions]
  );

  const getLikedQuotes = useCallback(
    () =>
      Object.values(state.reactions)
        .filter((r) => r.type === "liked")
        .sort((a, b) => b.timestamp - a.timestamp),
    [state.reactions]
  );

  const getDislikedQuotes = useCallback(
    () =>
      Object.values(state.reactions)
        .filter((r) => r.type === "disliked")
        .sort((a, b) => b.timestamp - a.timestamp),
    [state.reactions]
  );

  const likedCount = Object.values(state.reactions).filter(
    (r) => r.type === "liked"
  ).length;

  const dislikedCount = Object.values(state.reactions).filter(
    (r) => r.type === "disliked"
  ).length;

  const value: QuotesContextType = {
    state,
    addLike,
    addDislike,
    removeReaction,
    getReaction,
    getLikedQuotes,
    getDislikedQuotes,
    likedCount,
    dislikedCount,
  };

  return (
    <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>
  );
}

// Custom hook to use the context
export function useQuotes() {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error("useQuotes must be used within a QuotesProvider");
  }
  return context;
}
