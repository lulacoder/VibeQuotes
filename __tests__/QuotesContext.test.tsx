import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuotesProvider, useQuotes } from "@/context/QuotesContext";
import { Quote } from "@/lib/types";

// Test component that uses the context
function TestComponent() {
  const { addLike, addDislike, getReaction, likedCount, dislikedCount } = useQuotes();

  const testQuote: Quote = {
    _id: "test-quote-1",
    content: "Test quote content",
    author: "Test Author",
    authorSlug: "test-author",
    length: 18,
    tags: ["test"],
  };

  const reaction = getReaction(testQuote._id);

  return (
    <div>
      <p data-testid="liked-count">{likedCount}</p>
      <p data-testid="disliked-count">{dislikedCount}</p>
      <p data-testid="reaction">{reaction?.type || "none"}</p>
      <button onClick={() => addLike(testQuote)} data-testid="like-btn">
        Like
      </button>
      <button onClick={() => addDislike(testQuote)} data-testid="dislike-btn">
        Dislike
      </button>
    </div>
  );
}

describe("QuotesContext", () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  it("provides initial state with zero reactions", () => {
    render(
      <QuotesProvider>
        <TestComponent />
      </QuotesProvider>
    );

    expect(screen.getByTestId("liked-count")).toHaveTextContent("0");
    expect(screen.getByTestId("disliked-count")).toHaveTextContent("0");
    expect(screen.getByTestId("reaction")).toHaveTextContent("none");
  });

  it("adds a like when like button is clicked", () => {
    render(
      <QuotesProvider>
        <TestComponent />
      </QuotesProvider>
    );

    fireEvent.click(screen.getByTestId("like-btn"));

    expect(screen.getByTestId("liked-count")).toHaveTextContent("1");
    expect(screen.getByTestId("reaction")).toHaveTextContent("liked");
  });

  it("toggles like off when clicked twice", () => {
    render(
      <QuotesProvider>
        <TestComponent />
      </QuotesProvider>
    );

    fireEvent.click(screen.getByTestId("like-btn"));
    expect(screen.getByTestId("reaction")).toHaveTextContent("liked");

    fireEvent.click(screen.getByTestId("like-btn"));
    expect(screen.getByTestId("reaction")).toHaveTextContent("none");
    expect(screen.getByTestId("liked-count")).toHaveTextContent("0");
  });

  it("changes from like to dislike", () => {
    render(
      <QuotesProvider>
        <TestComponent />
      </QuotesProvider>
    );

    fireEvent.click(screen.getByTestId("like-btn"));
    expect(screen.getByTestId("reaction")).toHaveTextContent("liked");

    fireEvent.click(screen.getByTestId("dislike-btn"));
    expect(screen.getByTestId("reaction")).toHaveTextContent("disliked");
    expect(screen.getByTestId("liked-count")).toHaveTextContent("0");
    expect(screen.getByTestId("disliked-count")).toHaveTextContent("1");
  });

  it("persists reactions to localStorage", () => {
    render(
      <QuotesProvider>
        <TestComponent />
      </QuotesProvider>
    );

    fireEvent.click(screen.getByTestId("like-btn"));

    // Check that localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalled();
    const lastCall = localStorage.setItem.mock.calls[localStorage.setItem.mock.calls.length - 1];
    expect(lastCall[0]).toBe("vibeQuotes_reactions");
    
    const savedData = JSON.parse(lastCall[1]);
    expect(savedData["test-quote-1"]).toBeDefined();
    expect(savedData["test-quote-1"].type).toBe("liked");
  });
});
