# VibeQuotes Quality & UI Redesign Specification

> **For agentic workers:** This spec covers both quality improvements and UI transformation. Use superpowers:writing-plans to create implementation plan.

**Goal:** Transform VibeQuotes into a minimalist, editorial-style quote discovery app with improved code quality, performance, and animations.

---

## 1. UI/UX Specification

### Layout Structure

**Home Page**
- Quote text: Hero element, centered, max-width 800px
- Author & tags: Subtle sidebar (desktop) or below quote (mobile)
- Navigation: Minimal header with logo left, nav links right
- No card containers - pure typography composition

**Search Page**
- Full-width search bar at top
- Results: Vertical list with generous spacing (32px between items)
- Each result: Quote text (bold), author name below, tags as small pills

**Author Page**
- Large author name as header
- Bio in narrower column (max 600px)
- Quotes below in same vertical list format

**Favorites Page**
- Same list format as search results
- Filter: All / Liked / Disliked tabs

### Visual Design

**Color Palette**
```
--bg-primary: #FAFAFA (light) / #0A0A0A (dark)
--bg-secondary: #FFFFFF (light) / #141414 (dark)
--text-primary: #1A1A1A (light) / #FAFAFA (dark)
--text-secondary: #6B6B6B (light) / #A1A1A1 (dark)
--accent: #2563EB (minimal blue accent for interactive elements)
--divider: #E5E5E5 (light) / #262626 (dark)
```

**Typography**
- Quote text: "Playfair Display" (serif), 2.5rem desktop / 1.5rem mobile, font-weight 500
- Author name: "Inter" (sans), 1rem, font-weight 600, uppercase, letter-spacing 0.1em
- Body/tags: "Inter", 0.875rem, font-weight 400
- Line height: 1.6 for quotes, 1.4 for body

**Spacing System**
- Page padding: 48px desktop / 24px mobile
- Section gap: 64px
- Element gap: 16px
- Minimal component padding

**Visual Effects**
- No shadows, no borders on cards
- Subtle gradient backgrounds: very light gray to white (light) / dark gray to black (dark)
- Hover: text color shift only (no backgrounds)
- Page transitions: fade + subtle slide (200ms ease-out)

### Components

**QuoteDisplay** (new)
- Props: quote, author, tags, reaction status
- States: default, hovered (author link underline)
- No card wrapper - pure text composition

**MinimalHeader**
- Logo text left: "VibeQuotes" in Playfair Display
- Nav links right: Home, Search, Favorites
- Sticky on scroll with subtle backdrop blur

**SearchBar**
- Full width, underline style (no border box)
- Placeholder: "Search quotes or authors..."
- Debounced input (300ms)

**ReactionButton**
- Icon only (heart outline / filled)
- Positioned inline near quote text
- Subtle scale animation on click

**TagPill**
- Small rounded pill
- Subtle background on hover only

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 2. Functionality Specification

### Core Features (Existing, Preserved)
- Random quote on home page
- Tag-based suggestions ("More like this")
- Search by text, author, tags
- Author detail pages
- Favorites (like/dislike)
- Keyboard shortcuts (R for random, / for search focus)
- Dark mode with system preference
- Share / copy to clipboard

### New Quality Features

**Performance**
- Implement React Query for API caching (5 min stale time)
- Lazy load images with blur placeholder
- Code split routes with dynamic imports
- Prefetch linked pages on hover

**Accessibility**
- Full keyboard navigation
- ARIA labels on all interactive elements
- Focus visible states (custom outline)
- Screen reader announcements for dynamic content
- Reduced motion support (@media prefers-reduced-motion)

**Error Handling**
- Error boundaries around each route
- Fallback UI for API failures
- Retry button for failed requests
- Toast notifications for user actions

**SEO**
- Dynamic meta tags per page
- Open Graph tags for sharing
- Structured data for quotes (JSON-LD)
- Sitemap generation

### Animation Specification

**Page Transitions**
- Fade in: opacity 0 → 1, 200ms ease-out
- Content stagger: each element 50ms delay after previous

**Micro-interactions**
- Like button: scale 1 → 1.2 → 1, 150ms
- Search bar focus: underline grows from center, 150ms
- Link hover: underline slides in from left, 100ms
- Tag hover: subtle background fade, 100ms

**Reduced Motion**
- Disable all animations when prefers-reduced-motion is set

---

## 3. Technical Changes

### File Structure Updates

```
src/
├── app/
│   ├── page.tsx              # Home - simplified
│   ├── search/page.tsx       # Search results
│   ├── author/[slug]/page.tsx
│   ├── likes/page.tsx
│   ├── layout.tsx            # Add error boundary
│   └── error.tsx             # Custom error page
├── components/
│   ├── ui/
│   │   ├── QuoteDisplay.tsx # NEW - text-only display
│   │   ├── MinimalHeader.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ReactionButton.tsx
│   │   ├── TagPill.tsx
│   │   └── Toast.tsx
│   └── layout/
│       └── Footer.tsx
├── context/
│   ├── QuotesContext.tsx     # Keep, optimize
│   ├── ToastContext.tsx
│   └── ThemeContext.tsx
├── lib/
│   ├── api/
│   │   └── quotable.ts      # Add React Query hooks
│   └── utils/
│       └── cn.ts            # Utility for classNames
├── hooks/
│   ├── useQuotes.ts         # NEW - React Query hooks
│   └── useLocalStorage.ts
└── types/
    └── index.ts
```

### Testing Strategy
- Component tests: QuoteDisplay, SearchBar, ReactionButton
- Integration tests: Search flow, favorites flow
- E2E tests: Critical paths (load quote, search, like)
- Accessibility tests: axe-core in CI

### Code Quality
- Strict TypeScript (strict: true)
- ESLint with custom rules
- Prettier for formatting
- Conventional commits

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Home page shows quote as hero text, no cards
- [ ] Typography uses Playfair Display for quotes
- [ ] Minimal header with logo and nav
- [ ] Search results in vertical list format
- [ ] Dark mode toggle works with system preference
- [ ] Animations are smooth (60fps)

### Functional Checkpoints
- [ ] Random quote loads on home
- [ ] Search returns results
- [ ] Like/dislike persists to localStorage
- [ ] Keyboard shortcuts work (R, /)
- [ ] Share copies to clipboard
- [ ] Error states show fallback UI

### Quality Checkpoints
- [ ] Lighthouse performance score > 90
- [ ] Lighthouse accessibility score > 90
- [ ] All interactive elements keyboard accessible
- [ ] No console errors
- [ ] Tests pass (unit + integration)

---

## 5. Implementation Order

1. **Foundation** - Set up project structure, install React Query, update types
2. **UI Components** - Build new minimalist components (QuoteDisplay, MinimalHeader, etc.)
3. **Pages** - Update each page to use new components
4. **Quality** - Add error boundaries, SEO, accessibility
5. **Polish** - Add animations, transitions
6. **Testing** - Add tests, fix issues
