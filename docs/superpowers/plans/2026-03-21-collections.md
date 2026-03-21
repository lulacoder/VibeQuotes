# Collections Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Collections feature to vibeQuotes — pages, picker, and context updates — so users can organize quotes into named, color-coded boards.

**Architecture:** Extend the existing `CollectionsContext` (data layer already built) with a `getQuoteById` utility and `updateCollection` method. Build three UI surfaces: `/collections` index page, `/collections/[id]` detail page, and a `CollectionPicker` modal triggered from `QuoteCard`. Wire "Collections" into the `MinimalHeader` nav.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, Phosphor Icons, existing `CollectionsContext`, localStorage.

---

## Chunk 1: Utility + Context Foundation

### Task 1: Add `getQuoteById` utility

**Files:**
- Modify: `src/lib/api/quotes.ts`

- [ ] **Step 1: Add the `getQuoteById` function**

Add after the existing `getAllQuotes()` function (line 78):

```typescript
export function getQuoteById(id: string): Quote | undefined {
  return getAllQuotes().find((quote) => quote._id === id);
}
```

This is a synchronous function since both data sources (`quote-library.json` and `modern-quotes.ts`) are statically imported. It returns `undefined` if the ID isn't found in the local library (e.g., a stale Quotable API ID).

- [ ] **Step 2: Verify the function compiles**

Run: `npm run build` (or `npx tsc --noEmit`)
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/quotes.ts
git commit -m "feat: add getQuoteById utility to quotes API"
```

### Task 2: Extend `CollectionsContext` with `updateCollection`

**Files:**
- Modify: `src/context/CollectionsContext.tsx`

- [ ] **Step 1: Add `UPDATE_COLLECTION` to the action type union**

Add to `CollectionsAction` (after line 23):

```typescript
| { type: "UPDATE_COLLECTION"; payload: { id: string; name: string; description?: string; color?: string } }
```

- [ ] **Step 2: Add the reducer case for `UPDATE_COLLECTION`**

Add after the `RENAME_COLLECTION` case (after line 75):

```typescript
case "UPDATE_COLLECTION": {
  const col = state.collections[action.payload.id];
  if (!col) return state;
  return {
    ...state,
    collections: {
      ...state.collections,
      [action.payload.id]: {
        ...col,
        name: action.payload.name,
        description: action.payload.description ?? col.description,
        color: action.payload.color ?? col.color,
        updatedAt: Date.now(),
      },
    },
  };
}
```

- [ ] **Step 3: Add `updateCollection` to the context type interface**

Add to `CollectionsContextType` (after line 121):

```typescript
updateCollection: (id: string, name: string, description?: string, color?: string) => void;
```

- [ ] **Step 4: Add the `updateCollection` callback**

Add after `renameCollection` (after line 163):

```typescript
const updateCollection = useCallback((id: string, name: string, description?: string, color?: string) => {
  dispatch({ type: "UPDATE_COLLECTION", payload: { id, name, description, color } });
}, []);
```

- [ ] **Step 5: Add `updateCollection` to the context value**

Add `updateCollection` to the `value` object (line 179+):

```typescript
updateCollection,
```

- [ ] **Step 6: Add localStorage error toast**

The existing `useEffect` that syncs to localStorage (line 146) silently catches errors. Modify it to surface a toast when storage is full:

1. Import `useToast` from `@/context/ToastContext` (note: `CollectionsProvider` is already a child of `ToastProvider` in the layout, so this context is available)
2. Inside the `CollectionsProvider` component, destructure `addToast` from `useToast()`
3. Change the empty catch to:
```typescript
} catch {
  addToast("Storage full — delete a collection to free space", "error");
}
```

**Important:** This toast will fire on every state change while storage is full. To avoid spam, add a `storageErrorShown` ref that gates the toast to fire only once per page load:
```typescript
const storageErrorShown = useRef(false);
// ...in the catch:
if (!storageErrorShown.current) {
  addToast("Storage full — delete a collection to free space", "error");
  storageErrorShown.current = true;
}
```

- [ ] **Step 7: Verify the build compiles**

Run: `npm run build`
Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/context/CollectionsContext.tsx
git commit -m "feat: add updateCollection method and localStorage error toast to CollectionsContext"
```

---

## Chunk 2: MinimalHeader — Add Collections Nav Link

**Files:**
- Modify: `src/components/ui/MinimalHeader.tsx`

- [ ] **Step 1: Import a Collections icon**

Add `Folders` to the Phosphor imports (line 7):

```typescript
import { Compass, MagnifyingGlass, Heart, Folders } from '@phosphor-icons/react';
```

- [ ] **Step 2: Add Collections to the `navLinks` array**

Insert after the Archive/Search link (after line 14):

```typescript
{ href: '/collections', label: 'Collections', icon: Folders },
```

The `navLinks` array should now be:
```typescript
const navLinks = [
  { href: '/',            label: 'Home',       icon: Compass },
  { href: '/search',      label: 'Archive',    icon: MagnifyingGlass },
  { href: '/collections', label: 'Collections', icon: Folders },
  { href: '/likes',       label: 'Saved',      icon: Heart },
];
```

- [ ] **Step 3: Verify the nav renders**

Run: `npm run dev`, open `http://localhost:3000`
Expected: "Collections" link appears in the header between "Archive" and "Saved"

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/MinimalHeader.tsx
git commit -m "feat: add Collections nav link to header"
```

---

## Chunk 3: `/collections` Index Page

**Files:**
- Create: `src/app/collections/page.tsx`

- [ ] **Step 1: Create the collections index page**

Create `src/app/collections/page.tsx` with:

1. `"use client"` directive
2. Import `useCollections` from context, `motion` from framer-motion, `Link` from next/link, `Folders`, `Plus` from Phosphor icons
3. Import `useState` for the create modal state
4. Page structure:
   - Section eyebrow: "Your archive"
   - Heading: "Collections."
   - Subtitle: "Organize quotes that matter. All stored locally."
   - "+ New collection" button (opens a create modal/form)
   - Responsive card grid: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`
   - Each card: Link to `/collections/${col.id}`, with color accent top border, gradient bg, layered shadow, 16px radius
   - Card content: color label, name (font-bold), description, quote count, "last updated X ago"
   - Empty state: dashed border card prompting creation

5. Create Collection Modal (inline component or useState-driven):
   - Overlay/backdrop
   - Form with name (required), description (optional), color picker (4 color swatches: gold, sage, ember, smoke)
   - Submit calls `createCollection(name, description, color)`, navigates to new collection
   - Cancel closes modal

Use the design tokens from `globals.css`:
- `var(--color-bg-primary)`, `var(--color-bg-secondary)`, `var(--color-bg-elevated)`
- `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
- `var(--color-border-hard)`, `var(--color-accent-primary)`

Collection accent colors (map to CSS values):
- gold: `#d4a853`
- sage: `#6b8f71`
- ember: `#b45353`
- smoke: `#8a8a8a`

Tailwind classes to match existing pages:
- `noise-overlay`, `teal-orb` for background effects
- `section-eyebrow`, `font-display` for typography
- `card-hover` for hover effects (if defined in CSS)
- Framer Motion `initial/animate` for entrance animations

- [ ] **Step 2: Verify the page renders**

Run: `npm run dev`, navigate to `/collections`
Expected: Page renders with heading, empty state or collection cards

- [ ] **Step 3: Verify create flow works**

Click "+ New collection", fill in name "Test", pick a color, submit
Expected: Collection created, page shows new card, localStorage updated

- [ ] **Step 4: Commit**

```bash
git add src/app/collections/page.tsx
git commit -m "feat: add /collections index page with create flow"
```

---

## Chunk 4: `/collections/[id]` Detail Page

**Files:**
- Create: `src/app/collections/[id]/page.tsx`

- [ ] **Step 1: Create the collection detail page**

Create `src/app/collections/[id]/page.tsx` with:

1. `"use client"` directive
2. Import `useParams` from `next/navigation`, `useCollections`, `getQuoteById` from `@/lib/api/quotes`
3. Import `motion`, `AnimatePresence` from framer-motion, `Link` from next/link
4. Import `useToast` for error notifications
5. Import icons: `ArrowLeft`, `PencilSimple`, `Trash`, `BookOpenText`, `WarningCircle`

Page structure:
- Get `id` from `useParams()`
- Find collection from `collections` array by ID
- **Not found state:** If collection doesn't exist, redirect to `/collections` via `router.push` or show "Collection not found" with link back. Show a toast: "Collection not found" (error).
- Breadcrumb: `< Link href="/collections">Collections< /Link> / [name]`
- Collection name (font-display, font-black, 2rem), description
- Action buttons: "Edit" (opens inline edit form), "Delete" (confirmation dialog → deleteCollection → navigate to /collections)
- Stats pills: quote count with accent color, creation date formatted
- Quote list: iterate `collection.quoteIds`, call `getQuoteById(id)` for each
  - If quote found: show card with content (font-semibold), author link to `/author/[slug]`, "Remove" button
  - If quote not found: show fallback card "Quote unavailable" with "Remove" button
- **Empty state:** "No quotes yet" with link to `/search`
- Edit form (inline, toggled by "Edit" button):
  - Name input, description input, color swatches
  - Save calls `updateCollection(id, name, description, color)`
  - Cancel hides the form

**Note on file size:** This page has ~4-5 responsibilities (quote list, edit form, delete flow, not-found handling, empty state). If it exceeds 300 lines, extract `EditCollectionForm` and `CollectionQuoteItem` into separate components under `src/components/ui/`. For now, inline is fine — split only if the file grows large.

Quote card styling (matching the approved mockup):
- 16px radius, layered shadows
- 1.5rem padding, 1rem gap between cards
- Quote text: 600 weight, 1.15rem
- Author: 600 weight, 0.9rem
- Remove button: red tint background, 600 weight

Delete confirmation:
- Simple inline confirmation: "Delete this collection?" with "Cancel" and "Delete" buttons
- On confirm: `deleteCollection(id)`, navigate to `/collections`

- [ ] **Step 2: Verify the page renders with a collection**

Create a collection via `/collections`, click into it
Expected: Detail page shows name, description, empty state since no quotes yet

- [ ] **Step 3: Test error state**

Navigate to `/collections/nonexistent-id`
Expected: Redirect to `/collections` or shows "not found" message

- [ ] **Step 4: Test edit flow**

Click "Edit", change name, save
Expected: Name updates on page and in localStorage

- [ ] **Step 5: Test delete flow**

Click "Delete", confirm
Expected: Redirects to `/collections`, collection is gone

- [ ] **Step 6: Commit**

```bash
git add src/app/collections/[id]/page.tsx
git commit -m "feat: add /collections/[id] detail page with edit/delete"
```

---

## Chunk 5: CollectionPicker Component

**Files:**
- Create: `src/components/ui/CollectionPicker.tsx`

- [ ] **Step 1: Create the CollectionPicker component**

Create `src/components/ui/CollectionPicker.tsx` with:

1. `"use client"` directive
2. Props interface:
   ```typescript
   interface CollectionPickerProps {
     quoteId: string;
     onClose: () => void;
   }
   ```
3. Import `useCollections`, `useState`, `useEffect`, `useRef`
4. Import `motion`, `AnimatePresence` from framer-motion
5. Import icons: `X`, `Plus`, `Check`, `MagnifyingGlass`

Component structure:
- Modal overlay: fixed inset-0, dark backdrop with blur, z-50
- Modal panel: centered, 20px radius, massive layered shadow
- Gradient header: "Add to collection" title, close button (X)
- Search input: placeholder "Search or create...", inset shadow
- Collection list: scrollable, each item shows:
  - Color dot (12px circle with gradient + glow)
  - Collection name (700 weight if in collection, 500 if not)
  - Checkmark in blue pill if quote is already in the collection
  - Click toggles: if in → `removeFromCollection()`, if not → `addToCollection()`
- "Create new collection" card at bottom: dashed border, + icon, inline text input appears on click
  - On submit: `createCollection(name)` → `addToCollection(newId, quoteId)`
  - Color auto-assigned from COLLECTION_COLORS round-robin

Close behavior:
- Click outside (on backdrop) → close
- Press Escape → close
- Click X → close

Focus management:
- Auto-focus search input on mount
- Trap focus within modal

- [ ] **Step 2: Verify the picker renders**

Import and render CollectionPicker with a test quoteId
Expected: Modal appears with list of collections

- [ ] **Step 3: Test add/remove toggle**

Click a collection not in → quote added (checkmark appears)
Click same collection again → quote removed (checkmark disappears)
Expected: localStorage updates, visual state toggles

- [ ] **Step 4: Test inline create**

Click "Create new collection", type "Test", submit
Expected: New collection created, quote added to it

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CollectionPicker.tsx
git commit -m "feat: add CollectionPicker modal component"
```

---

## Chunk 6: QuoteCard Integration

**Files:**
- Modify: `src/components/ui/QuoteCard.tsx`

- [ ] **Step 1: Add CollectionPicker state and import**

Add imports:
```typescript
import { useState } from "react";
import { CollectionPicker } from "./CollectionPicker";
import { Plus } from "@phosphor-icons/react";
```

Note: `Plus` may need to be imported alongside existing icon imports from `@phosphor-icons/react`.

Add state inside the component:
```typescript
const [pickerOpen, setPickerOpen] = useState(false);
```

- [ ] **Step 2: Add the + button to the action row**

In the action buttons div (line 69), add the + button before the LikeButton:

```tsx
<button
  onClick={() => setPickerOpen(true)}
  aria-label="Add to collection"
  className="icon-btn"
  style={{
    background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(14,165,233,0.05))",
    borderColor: "rgba(14,165,233,0.5)",
    borderWidth: "2px",
    boxShadow: "0 2px 12px rgba(14,165,233,0.2)",
  }}
>
  <Plus className="h-3.5 w-3.5 text-[#38bdf8]" weight="bold" />
</button>
```

- [ ] **Step 3: Render the CollectionPicker conditionally**

At the bottom of the component's return, before the closing `</motion.article>`:

```tsx
{pickerOpen && (
  <CollectionPicker
    quoteId={quote._id}
    onClose={() => setPickerOpen(false)}
  />
)}
```

- [ ] **Step 4: Verify the + button appears on quote cards**

Run: `npm run dev`, check home page and search page
Expected: Blue + button appears on every QuoteCard

- [ ] **Step 5: Verify picker opens and closes**

Click + on a quote card
Expected: CollectionPicker modal appears
Click outside or X
Expected: Modal closes

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/QuoteCard.tsx
git commit -m "feat: integrate CollectionPicker into QuoteCard"
```

---

## Chunk 7: Edge Cases + Polish

**Files:**
- Modify: `src/app/collections/page.tsx`
- Modify: `src/app/collections/[id]/page.tsx`
- Modify: `src/components/ui/CollectionPicker.tsx`

- [ ] **Step 1: Add toast notifications for key actions**

Use `useToast()` from context:
- Collection created: "Collection created" (success)
- Quote added to collection: "Added to [name]" (success)
- Quote removed from collection: "Removed from [name]" (info)
- Collection deleted: "Collection deleted" (info)
- localStorage error: handled in CollectionsContext (Chunk 1, Step 6) — no duplicate toast needed here

- [ ] **Step 2: Add keyboard support**

- `Escape` closes CollectionPicker modal
- `Enter` submits create forms

- [ ] **Step 3: Add Framer Motion animations**

- Collection cards: stagger fade-in (delay index * 0.05)
- Quote items in detail: stagger fade-in
- Picker modal: scale + fade entrance
- Collection card hover: subtle scale on card-hover class

- [ ] **Step 4: Handle responsive layouts**

- `/collections`: 1 col mobile, 2 col tablet, 3 col desktop
- Collection detail: full width on all sizes
- Picker modal: max-width 360px, full width on mobile with margin

- [ ] **Step 5: Verify all edge cases**

- Navigate to `/collections/[invalid-id]` → redirects or shows not found
- View empty collection → shows "No quotes yet" state
- Try adding same quote to same collection twice → no duplicate (context handles this)
- Open picker when no collections exist → shows "Create new" prompt

- [ ] **Step 6: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: No errors

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: polish collections — toasts, animations, edge cases"
```

---

## File Changes Summary

| File | Action | Chunk |
|------|--------|-------|
| `src/lib/api/quotes.ts` | Modify — add `getQuoteById` | 1 |
| `src/context/CollectionsContext.tsx` | Modify — add `updateCollection` | 1 |
| `src/components/ui/MinimalHeader.tsx` | Modify — add Collections nav link | 2 |
| `src/app/collections/page.tsx` | Create — collections index page | 3 |
| `src/app/collections/[id]/page.tsx` | Create — collection detail page | 4 |
| `src/components/ui/CollectionPicker.tsx` | Create — modal picker component | 5 |
| `src/components/ui/QuoteCard.tsx` | Modify — add + button and picker | 6 |
