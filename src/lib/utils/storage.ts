import { Reaction } from "@/lib/types";

const STORAGE_KEY = "vibeQuotes_reactions";
const THEME_KEY = "vibeQuotes_theme";

// Load reactions from localStorage
export function loadReactions(): Record<string, Reaction> {
  if (typeof window === "undefined") return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to load reactions from localStorage:", error);
    return {};
  }
}

// Save reactions to localStorage
export function saveReactions(reactions: Record<string, Reaction>): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
  } catch (error) {
    console.error("Failed to save reactions to localStorage:", error);
  }
}

// Load theme preference
export function loadTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === "dark" || theme === "light" ? theme : null;
  } catch {
    return null;
  }
}

// Save theme preference
export function saveTheme(theme: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme to localStorage:", error);
  }
}

// Get liked quotes count
export function getLikedCount(): number {
  const reactions = loadReactions();
  return Object.values(reactions).filter((r) => r.type === "liked").length;
}

// Get disliked quotes count
export function getDislikedCount(): number {
  const reactions = loadReactions();
  return Object.values(reactions).filter((r) => r.type === "disliked").length;
}

// Check if storage is available
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
