import { getQuotesByAuthorSlug, searchUnifiedQuotes, getAllAuthors } from "@/lib/api/quotes";

describe("local quote api", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock | undefined)?.mockClear?.();
  });

  it("serves author quotes from the local library without fetching", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 0,
        totalCount: 0,
        page: 1,
        totalPages: 0,
        lastItemIndex: null,
        results: [],
      }),
    });
    global.fetch = fetchMock as any;

    const result = await getQuotesByAuthorSlug("albert-einstein", 1, 20);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.results[0]?.author).toBe("Albert Einstein");
  });

  it("searches classic quotes from the local library", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 0,
        totalCount: 0,
        page: 1,
        totalPages: 0,
        lastItemIndex: null,
        results: [],
      }),
    });
    global.fetch = fetchMock as any;

    const result = await searchUnifiedQuotes("imagination", "all", undefined, 1, 10);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.results.some((quote) => quote.author === "Albert Einstein")).toBe(true);
  });

  it("exposes the expanded local author index", () => {
    const authors = getAllAuthors();

    expect(authors.length).toBeGreaterThan(5);
    expect(authors.some((author) => author.slug === "albert-einstein")).toBe(true);
    expect(authors.some((author) => author.slug === "alex-hormozi")).toBe(true);
  });
});
