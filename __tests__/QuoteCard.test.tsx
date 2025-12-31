import React from "react";
import { render, screen } from "@testing-library/react";
import { QuoteCard } from "@/components/ui/QuoteCard";
import { QuotesProvider } from "@/context/QuotesContext";
import { ToastProvider } from "@/context/ToastContext";
import { Quote } from "@/lib/types";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockQuote: Quote = {
  _id: "test-123",
  content: "The only way to do great work is to love what you do.",
  author: "Steve Jobs",
  authorSlug: "steve-jobs",
  length: 52,
  tags: ["wisdom", "work", "passion"],
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <QuotesProvider>{ui}</QuotesProvider>
    </ToastProvider>
  );
};

describe("QuoteCard", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
  });

  it("renders quote content", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} />);

    expect(
      screen.getByText(/The only way to do great work is to love what you do/i)
    ).toBeInTheDocument();
  });

  it("renders author name", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} />);

    expect(screen.getByText(/Steve Jobs/i)).toBeInTheDocument();
  });

  it("renders tags when showFullMeta is true", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} showFullMeta={true} />);

    expect(screen.getByText("wisdom")).toBeInTheDocument();
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("passion")).toBeInTheDocument();
  });

  it("has like and dislike buttons", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} />);

    expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dislike/i)).toBeInTheDocument();
  });

  it("has a share button", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} />);

    expect(screen.getByLabelText(/share/i)).toBeInTheDocument();
  });

  it("displays character count", () => {
    renderWithProviders(<QuoteCard quote={mockQuote} showFullMeta={true} />);

    expect(screen.getByText(/52 characters/i)).toBeInTheDocument();
  });
});
