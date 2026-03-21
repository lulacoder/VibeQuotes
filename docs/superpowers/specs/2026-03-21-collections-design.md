# Collections Feature — Design Spec

**Date:** 2026-03-21
**Status:** Draft
**Scope:** Add quote collections UI to vibeQuotes

## Summary

Add a Collections feature that lets users organize quotes into named, color-coded boards. Collections are separate from the existing like/dislike system — a quote can be in a collection without being liked. All data persists in localStorage via the existing `CollectionsContext`.

The data layer already exists (`src/context/CollectionsContext.tsx`) with full CRUD operations and localStorage sync. This spec covers the missing UI surfaces only.

## Goals

- Let users create named collections with optional descriptions and accent colors
- Add quotes to collections from anywhere a QuoteCard renders (home, search, author, likes)
- Browse and manage collections on a dedicated `/collections` page
- View and remove quotes within a collection on `/collections/[id]`

## Non-Goals

- Mood browsing, daily quotes, personal notes (future features)
- Syncing collections to a server or across devices
- Sharing collections publicly
- Reordering quotes within a collection

---

## Design Decisions

### Navigation

Add "Collections" as a top-level link in the header nav (`src/components/layout/Header.tsx`), placed between existing links. Collections are conceptually distinct from likes — they are organized, purposeful groupings, not a flat reaction log.

### Collections are independent from likes

A quote can be liked AND in a collection, or in a collection without liking it. No coupling between the two systems.

---

## Pages

### 1. `/collections` — Collections Index

**Route:** `src/app/collections/page.tsx`

**Layout:**
- Page heading: "Collections." with subtitle "Organize quotes that matter. All stored locally."
- "+ New collection" button in the heading area
- Card grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)

**Collection Card:**
- Top border with collection accent color (3px solid)
- Subtle gradient background using the accent color
- Layered box shadow for depth (`0 4px 24px` + `0 1px 4px`)
- 16px border radius
- Content: color category label, collection name (700 weight), description, quote count, last updated
- Click navigates to `/collections/[id]`

**Empty State:**
- Dashed border card with "+" icon prompting creation

**Create Collection Flow:**
- Clicking "+ New collection" opens an inline modal/form
- Fields: name (required), description (optional), color (preset options: gold, sage, ember, smoke)
- On submit: calls `createCollection()` from context, navigates to new collection

**Data Source:** `useCollections()` from `CollectionsContext`

### 2. `/collections/[id]` — Collection Detail

**Route:** `src/app/collections/[id]/page.tsx`

**Layout:**
- Breadcrumb: "Collections / [name]"
- Collection name (900 weight, 2rem), description
- Action buttons: Edit, Delete
- Stats pills: quote count (with accent color), creation date
- Vertical list of quotes (simplified QuoteDisplay)

**Quote Items:**
- 16px radius, layered shadows, 1.5rem padding
- Quote text (600 weight, 1.15rem), author (600 weight)
- "Remove" button per quote (red tint) — calls `removeFromCollection()`
- Clicking author navigates to `/author/[slug]`

**Edit Flow:**
- "Edit" button opens inline form with name, description, color fields
- Requires extending `CollectionsContext` with an `updateCollection()` method (or extending `renameCollection()` to accept `description` and `color` fields). Currently the context only supports renaming — a new action `UPDATE_COLLECTION` is needed.

**Delete Flow:**
- "Delete" button with confirmation dialog
- Calls `deleteCollection()`, navigates to `/collections`

**Data Source:** `useCollections()` — find collection by ID from context state. Resolve `quoteIds` against the local quote library (`src/data/quote-library.json` and `src/data/modern-quotes.ts`). Requires a new `getQuoteById(id: string): Quote | undefined` utility in `src/lib/api/quotes.ts` that searches both sources. Quote IDs stored in collections match the `Quote._id` field (which maps from the library's `id` field via `localToQuote`/`modernToQuote`). If a quote ID is not found (e.g., it was from a Quotable API response that's no longer cached), show a fallback card with just the quote ID and a "Quote unavailable" message.

**Error Handling:**
- Invalid collection ID in URL: redirect to `/collections` or show "Collection not found" page
- Empty collection: show a "No quotes yet" empty state with a link to browse the archive
- localStorage full or unavailable: catch errors in context, show a non-blocking toast notification

---

## Components

### `CollectionPicker` — Add to Collection Modal

**File:** `src/components/ui/CollectionPicker.tsx`

Triggered by a new **+** button on `QuoteCard`. Modal/dropdown overlay.

**Visual Design:**
- 20px radius, massive layered shadow (`0 20px 60px`)
- Gradient header with title and close button
- Search/filter input with inset shadow
- List of collections with gradient color dots (glowing box-shadow). If multiple collections share a name, disambiguate by showing the color dot + quote count (e.g., "Motivation (12)")
- Items the quote is already in: blue highlight, checkmark in a pill
- Items the quote is not in: plain, hover highlight
- "Create new collection" at bottom with dashed border card

**Behavior:**
- Clicking a collection toggles the quote in/out (calls `addToCollection()` or `removeFromCollection()`)
- "Create new" opens inline text input, creates collection and adds quote. Color auto-assigned from the `COLLECTION_COLORS` fallback (round-robin based on existing collection count), matching the current `CREATE_COLLECTION` reducer behavior. No color picker in the inline flow — users can change color later via the Edit action on the collection detail page.
- Closes on outside click or close button
- Search filters collection list by name

**Integration Points:**
- New button added to `QuoteCard.tsx` action row
- Passes `quote._id` to the picker
- Uses `useCollections()` for state

### Updated `QuoteCard`

**File:** `src/components/ui/QuoteCard.tsx`

Add a new **+** action button between existing actions:
- 32px rounded button with blue accent styling (gradient fill, thicker border, glow shadow)
- Opens `CollectionPicker` modal on click
- Out of scope for v1: visual badge on the card indicating collection membership. The picker itself shows membership state.

### Updated `Header`

**File:** `src/components/layout/Header.tsx`

Add "Collections" nav link, positioned in the existing navigation.

---

## Data Model

No changes needed — the existing `Collection` interface in `CollectionsContext.tsx` covers everything:

```typescript
interface Collection {
  id: string;
  name: string;
  description?: string;
  quoteIds: string[];
  createdAt: number;
  updatedAt: number;
  color?: string; // "gold" | "sage" | "ember" | "smoke"
}
```

**Storage key:** `vibequotes-collections` (already defined)

**Color presets:** gold, sage, ember, smoke (already defined as `COLLECTION_COLORS`)

---

## Visual Style Guide

Based on approved mockups:

| Element | Style |
|---------|-------|
| Card radius | 16-20px |
| Card shadows | Layered: `0 4px 24px` + `0 1px 4px` (cards), `0 20px 60px` (modals) |
| Card backgrounds | Subtle gradient using accent color + base bg |
| Text weight | Headings 800-900, body 600, labels 700 |
| Accent colors | gold `#d4a853`, sage `#6b8f71`, ember `#b45353`, smoke `#8a8a8a` |
| Action buttons | 32px, 10px radius, subtle shadow, 0.5rem gap |
| + button | Blue accent: `#38bdf8`, gradient fill, glow border/shadow |
| Modal input | Inset shadow, 10px radius |

---

## Edge Cases

| Case | Handling |
|------|----------|
| Invalid collection ID in URL | Redirect to `/collections` with a toast: "Collection not found" |
| Collection detail page with 0 quotes | Show "No quotes yet" empty state with link to `/search` |
| Duplicate collection names | Allowed — collections are distinguished by ID, not name |
| localStorage quota exceeded | Catch in context `useEffect`, show toast: "Storage full — delete a collection to free space" |
| Quote ID not found in local data | Show fallback card: "Quote unavailable" with the ID, plus a "Remove" button |
| Renaming to empty string | Prevent in UI — disable submit if name is empty |
| Deleting a collection while on its detail page | Redirect to `/collections` after delete |

---

## Context API Changes

The existing `CollectionsContext` needs one new method for the edit flow:

```typescript
// New action
| { type: "UPDATE_COLLECTION"; payload: { id: string; name: string; description?: string; color?: string } }

// New method in CollectionsContextType
updateCollection: (id: string, name: string, description?: string, color?: string) => void;
```

This replaces the need to call `renameCollection()` separately. The existing `renameCollection` method can be kept for backwards compatibility or removed if nothing else uses it.

---

## File Changes Summary

| File | Action |
|------|--------|
| `src/app/collections/page.tsx` | **Create** — collections index page |
| `src/app/collections/[id]/page.tsx` | **Create** — collection detail page |
| `src/components/ui/CollectionPicker.tsx` | **Create** — modal picker component |
| `src/components/ui/QuoteCard.tsx` | **Modify** — add + button and picker integration |
| `src/components/layout/Header.tsx` | **Modify** — add Collections nav link |
| `src/lib/api/quotes.ts` | **Modify** — add `getQuoteById()` utility |
| `src/context/CollectionsContext.tsx` | **Modify** — add `updateCollection` method and `UPDATE_COLLECTION` action |

---

## Acceptance Criteria

1. User can navigate to `/collections` from the header
2. User can create a new collection with name, description, and color
3. User can click a collection card to view its quotes
4. User can edit (rename, change color/description) and delete a collection
5. User can remove quotes from a collection
6. User can click the + button on any quote card to open the collection picker
7. User can add a quote to a collection from the picker
8. User can create a new collection inline from the picker
9. The picker shows which collections a quote already belongs to (checkmark toggle)
10. All collection data persists in localStorage and survives page reloads
11. Collections are independent of likes — adding to a collection does not like the quote
12. Navigating to an invalid collection ID shows a "not found" state, not a crash
13. Empty collection detail page shows a helpful empty state with link to browse quotes
