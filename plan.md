Build a small Next.js quote app that uses the Quotable API (https://api.quotable.io
) to fetch quotes and shows reliable author attributions. No authentication and no server database — persist all user reactions (like/dislike) in the browser using localStorage. Use React Context for app-wide state so any page/component can read/update likes and dislikes and the app keeps context awareness (counts, filters, etc.).

Requirements

Tech: Next.js (App Router), React (hooks + Context), plain CSS or Tailwind allowed, no backend/data store.

Data source: Quotable API. Use these endpoints:

Random quote: GET https://api.quotable.io/random

Search / list: GET https://api.quotable.io/quotes?query={q}&author={author}&page={p}&limit={n}

Author quotes: GET https://api.quotable.io/quotes?author={authorSlug}

Persist user reactions in localStorage. Schema must support per-quote liked, disliked, and timestamps.

Use a QuotesContext with a reducer: actions ADD_LIKE, ADD_DISLIKE, REMOVE_REACTION, HYDRATE_FROM_STORAGE.

App features:

Home: show a random quote and “More like this” suggestions.

Search: search by text or author, with paginated results.

Author page: show author info + list of quotes by that author.

Likes view: show all liked quotes (from localStorage).

Ability to like/dislike any quote from any view. UI shows current reaction instantly (optimistic).

No external analytics or tracking.

UX notes:

Show source metadata when available (author + tags + length + link to original if you add one).

UI should show whether a quote is liked/disliked.

Keep the app offline-tolerant: reactions work even when fetch fails.

Tests: simple smoke tests (component renders, liking toggles in context/localStorage).

Deliverables: Next.js app repo with README.md (how to run) and components.

Acceptance criteria

User can search “Elon Musk” or “Alex Hormozi” and see any quotes present in Quotable for that author.

Likes/dislikes are available across pages and survive reloads (persisted in localStorage).

UI updates instantly when user likes/dislikes.

Code is modular and easy to extend to add a DB later.