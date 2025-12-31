import { loadReactions, saveReactions, loadTheme, saveTheme, isStorageAvailable } from "@/lib/utils/storage";

describe("Storage Utils", () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  describe("loadReactions", () => {
    it("returns empty object when localStorage is empty", () => {
      localStorage.getItem.mockReturnValue(null);
      
      const result = loadReactions();
      
      expect(result).toEqual({});
    });

    it("returns parsed reactions from localStorage", () => {
      const mockReactions = {
        "quote-1": {
          quoteId: "quote-1",
          type: "liked",
          timestamp: 123456,
          quoteSnapshot: {
            content: "Test",
            author: "Author",
            authorSlug: "author",
            tags: [],
          },
        },
      };
      localStorage.getItem.mockReturnValue(JSON.stringify(mockReactions));
      
      const result = loadReactions();
      
      expect(result).toEqual(mockReactions);
    });

    it("returns empty object on parse error", () => {
      localStorage.getItem.mockReturnValue("invalid json");
      
      const result = loadReactions();
      
      expect(result).toEqual({});
    });
  });

  describe("saveReactions", () => {
    it("saves reactions to localStorage", () => {
      const reactions = {
        "quote-1": {
          quoteId: "quote-1",
          type: "liked" as const,
          timestamp: 123456,
          quoteSnapshot: {
            content: "Test",
            author: "Author",
            authorSlug: "author",
            tags: [],
          },
        },
      };
      
      saveReactions(reactions);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "vibeQuotes_reactions",
        JSON.stringify(reactions)
      );
    });
  });

  describe("loadTheme", () => {
    it("returns null when no theme is saved", () => {
      localStorage.getItem.mockReturnValue(null);
      
      const result = loadTheme();
      
      expect(result).toBeNull();
    });

    it("returns saved theme", () => {
      localStorage.getItem.mockReturnValue("dark");
      
      const result = loadTheme();
      
      expect(result).toBe("dark");
    });
  });

  describe("saveTheme", () => {
    it("saves theme to localStorage", () => {
      saveTheme("dark");
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "vibeQuotes_theme",
        "dark"
      );
    });
  });
});
