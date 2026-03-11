"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface Collection {
  id: string;
  name: string;
  description?: string;
  quoteIds: string[];
  createdAt: number;
  updatedAt: number;
  color?: string; // accent color for the collection
}

interface CollectionsState {
  collections: Record<string, Collection>;
  hydrated: boolean;
}

type CollectionsAction =
  | { type: "CREATE_COLLECTION"; payload: { name: string; description?: string; color?: string } }
  | { type: "DELETE_COLLECTION"; payload: { id: string } }
  | { type: "RENAME_COLLECTION"; payload: { id: string; name: string } }
  | { type: "ADD_TO_COLLECTION"; payload: { collectionId: string; quoteId: string } }
  | { type: "REMOVE_FROM_COLLECTION"; payload: { collectionId: string; quoteId: string } }
  | { type: "HYDRATE"; payload: Record<string, Collection> };

const STORAGE_KEY = "vibequotes-collections";

const COLLECTION_COLORS = [
  "gold",
  "ember",
  "sage",
  "smoke",
];

function collectionsReducer(state: CollectionsState, action: CollectionsAction): CollectionsState {
  switch (action.type) {
    case "CREATE_COLLECTION": {
      const id = `col-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const now = Date.now();
      return {
        ...state,
        collections: {
          ...state.collections,
          [id]: {
            id,
            name: action.payload.name,
            description: action.payload.description,
            color: action.payload.color ?? COLLECTION_COLORS[Object.keys(state.collections).length % COLLECTION_COLORS.length],
            quoteIds: [],
            createdAt: now,
            updatedAt: now,
          },
        },
      };
    }
    case "DELETE_COLLECTION": {
      const { [action.payload.id]: _, ...rest } = state.collections;
      return { ...state, collections: rest };
    }
    case "RENAME_COLLECTION": {
      const col = state.collections[action.payload.id];
      if (!col) return state;
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.payload.id]: {
            ...col,
            name: action.payload.name,
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "ADD_TO_COLLECTION": {
      const col = state.collections[action.payload.collectionId];
      if (!col) return state;
      if (col.quoteIds.includes(action.payload.quoteId)) return state;
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.payload.collectionId]: {
            ...col,
            quoteIds: [...col.quoteIds, action.payload.quoteId],
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "REMOVE_FROM_COLLECTION": {
      const col = state.collections[action.payload.collectionId];
      if (!col) return state;
      return {
        ...state,
        collections: {
          ...state.collections,
          [action.payload.collectionId]: {
            ...col,
            quoteIds: col.quoteIds.filter((id) => id !== action.payload.quoteId),
            updatedAt: Date.now(),
          },
        },
      };
    }
    case "HYDRATE": {
      return { collections: action.payload, hydrated: true };
    }
    default:
      return state;
  }
}

interface CollectionsContextType {
  collections: Collection[];
  createCollection: (name: string, description?: string, color?: string) => void;
  deleteCollection: (id: string) => void;
  renameCollection: (id: string, name: string) => void;
  addToCollection: (collectionId: string, quoteId: string) => void;
  removeFromCollection: (collectionId: string, quoteId: string) => void;
  getCollectionsForQuote: (quoteId: string) => Collection[];
  hydrated: boolean;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collectionsReducer, { collections: {}, hydrated: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: "HYDRATE", payload: parsed });
      } else {
        dispatch({ type: "HYDRATE", payload: {} });
      }
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.collections));
      } catch {}
    }
  }, [state.collections, state.hydrated]);

  const createCollection = useCallback((name: string, description?: string, color?: string) => {
    dispatch({ type: "CREATE_COLLECTION", payload: { name, description, color } });
  }, []);

  const deleteCollection = useCallback((id: string) => {
    dispatch({ type: "DELETE_COLLECTION", payload: { id } });
  }, []);

  const renameCollection = useCallback((id: string, name: string) => {
    dispatch({ type: "RENAME_COLLECTION", payload: { id, name } });
  }, []);

  const addToCollection = useCallback((collectionId: string, quoteId: string) => {
    dispatch({ type: "ADD_TO_COLLECTION", payload: { collectionId, quoteId } });
  }, []);

  const removeFromCollection = useCallback((collectionId: string, quoteId: string) => {
    dispatch({ type: "REMOVE_FROM_COLLECTION", payload: { collectionId, quoteId } });
  }, []);

  const getCollectionsForQuote = useCallback(
    (quoteId: string) => Object.values(state.collections).filter((c) => c.quoteIds.includes(quoteId)),
    [state.collections]
  );

  const value: CollectionsContextType = {
    collections: Object.values(state.collections).sort((a, b) => b.updatedAt - a.updatedAt),
    createCollection,
    deleteCollection,
    renameCollection,
    addToCollection,
    removeFromCollection,
    getCollectionsForQuote,
    hydrated: state.hydrated,
  };

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}

export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error("useCollections must be used within CollectionsProvider");
  return ctx;
}
