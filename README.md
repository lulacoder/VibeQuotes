# VibeQuotes 🌟

A modern, beautiful quote discovery app built with Next.js 14. Search quotes, save favorites, and find inspiration from great minds throughout history.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?logo=framer)

## ✨ Features

- **🎲 Random Quotes** - Discover inspiring quotes with "More like this" tag-based suggestions
- **🔍 Powerful Search** - Search by text, author, or tags with paginated results
- **👤 Author Pages** - View author bios and all their quotes
- **❤️ Favorites** - Like/dislike quotes with instant UI feedback
- **💾 Offline-First** - All reactions stored in localStorage, work without internet
- **🌓 Dark Mode** - Beautiful light and dark themes with system preference detection
- **⌨️ Keyboard Shortcuts** - Press `R` for new quote, `/` to focus search
- **📱 Responsive** - Looks great on all devices
- **🎨 Smooth Animations** - Powered by Framer Motion
- **📤 Share Quotes** - Native share or copy to clipboard

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibe-quotes.git
cd vibe-quotes
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home - random quote + suggestions
│   ├── search/            # Search page with filters
│   ├── author/[slug]/     # Author detail page
│   ├── likes/             # Favorites collection
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
│
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── QuoteCard.tsx  # Quote display with actions
│   │   ├── LikeButton.tsx # Like/dislike controls
│   │   ├── SearchBar.tsx  # Debounced search input
│   │   ├── Pagination.tsx # Page navigation
│   │   └── ...
│   └── layout/            # Layout components
│       ├── Header.tsx     # Navigation header
│       └── Footer.tsx     # Page footer
│
├── context/               # React Context providers
│   ├── QuotesContext.tsx  # Reactions state + localStorage sync
│   ├── ToastContext.tsx   # Toast notifications
│   └── ThemeContext.tsx   # Dark/light mode
│
└── lib/
    ├── api/               # API client functions
    │   └── quotable.ts    # Quotable API wrapper
    ├── types/             # TypeScript definitions
    │   └── index.ts       # Shared types
    └── utils/             # Utility functions
        └── storage.ts     # localStorage helpers
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with custom theme colors defined in `tailwind.config.ts`:

- **Primary**: Sky blue (#0ea5e9)
- **Accent**: Fuchsia/purple (#d946ef)

### API

Uses the [Quotable API](https://github.com/lukePeavey/quotable) for quote data. No API key required.

**Note**: Some modern authors (e.g., Elon Musk, Alex Hormozi) may not be available in the Quotable database as it focuses on historical and literary quotes.

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Load a new random quote |
| `/` | Focus the search bar |

## 💾 Data Persistence

User reactions (likes/dislikes) are stored in localStorage with the following schema:

```typescript
interface Reaction {
  quoteId: string;
  type: "liked" | "disliked";
  timestamp: number;
  quoteSnapshot: {
    content: string;
    author: string;
    authorSlug: string;
    tags: string[];
  };
}
```

The `quoteSnapshot` ensures liked quotes are viewable even when offline.

## 🧩 Extending the App

The codebase is designed to be modular and extensible:

1. **Add a Database**: Replace localStorage calls in `QuotesContext.tsx` and `storage.ts` with your database client
2. **Add Authentication**: Wrap providers in `layout.tsx` with your auth provider
3. **Add More Quote Sources**: Create new API clients in `lib/api/`
4. **Custom Themes**: Extend the Tailwind config with more color schemes

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
npm run test:watch
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## 🌐 API Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `GET /quotes/random` | Fetch random quotes |
| `GET /quotes` | List/filter quotes |
| `GET /search/quotes` | Full-text search |
| `GET /authors` | Get author info |

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own apps!

## 🙏 Credits

- [Quotable API](https://github.com/lukePeavey/quotable) for the quote database
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Built with ❤️ using Next.js
