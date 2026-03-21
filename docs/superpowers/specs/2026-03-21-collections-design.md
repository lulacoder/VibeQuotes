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
- Calls `renameCollection()` and updates color/description

**Delete Flow:**
- "Delete" button with confirmation dialog
- Calls `deleteCollection()`, navigates to `/collections`

**Data Source:** `useCollections()` — find collection by ID, resolve quoteIds against local quote data

---

## Components

### `CollectionPicker` — Add to Collection Modal

**File:** `src/components/ui/CollectionPicker.tsx`

Triggered by a new **+** button on `QuoteCard`. Modal/dropdown overlay.

**Visual Design:**
- 20px radius, massive layered shadow (`0 20px 60px`)
- Gradient header with title and close button
- Search/filter input with inset shadow
- List of collections with gradient color dots (glowing box-shadow)
- Items the quote is already in: blue highlight, checkmark in a pill
- Items the quote is not in: plain, hover highlight
- "Create new collection" at bottom with dashed border card

**Behavior:**
- Clicking a collection toggles the quote in/out (calls `addToCollection()` or `removeFromCollection()`)
- "Create new" opens inline text input, creates collection and adds quote
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
- Visual indicator if quote is in any collection (optional: small badge)

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

## File Changes Summary

| File | Action |
|------|--------|
| `src/app/collections/page.tsx` | **Create** — collections index page |
| `src/app/collections/[id]/page.tsx` | **Create** — collection detail page |
| `src/components/ui/CollectionPicker.tsx` | **Create** — modal picker component |
| `src/components/ui/QuoteCard.tsx` | **Modify** — add + button and picker integration |
| `src/components/layout/Header.tsx` | **Modify** — add Collections nav link |
| `src/context/CollectionsContext.tsx` | **No change** — data layer already complete |

---

## Acceptance Criteria

1. User can navigate to `/collections` from the header
2. User can create a new collection with name, description, and color
3. User can click a collection card to view its quotes
4. User can edit (rename, change color) and delete a collection
5. User can remove quotes from a collection
6. User can click the + button on any quote card to open the collection picker
7. User can add a quote to a collection from the picker
8. User can create a new collection inline from the picker
9. The picker shows which collections a quote already belongs to
10. All collection data persists in localStorage and survives page reloads
11. Collections are independent of likes — adding to a collection does not like the quote
