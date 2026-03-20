import type { Metadata } from "next";
import "./globals.css";
import { QuotesProvider } from "@/context/QuotesContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CollectionsProvider } from "@/context/CollectionsContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { MinimalHeader } from "@/components/ui/MinimalHeader";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

export const metadata: Metadata = {
  title: "VibeQuotes — Discover Wisdom",
  description:
    "A tech-powered quote discovery experience. Explore wisdom from the world's greatest minds.",
  keywords: ["quotes", "inspiration", "wisdom", "motivation", "daily quotes", "philosophy", "entrepreneurs"],
  authors: [{ name: "VibeQuotes" }],
  openGraph: {
    title: "VibeQuotes — Discover Wisdom",
    description: "A tech-powered quote discovery experience.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] antialiased">
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <QuotesProvider>
                <CollectionsProvider>
                  <MinimalHeader />
                  <main className="pt-16">{children}</main>
                  <Footer />
                  <ToastContainer />
                  <KeyboardShortcuts />
                </CollectionsProvider>
              </QuotesProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
