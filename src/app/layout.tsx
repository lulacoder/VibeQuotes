import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VibeQuotes — Discover Wisdom",
  description:
    "A cinematic quote discovery experience. Explore timeless wisdom from the world's greatest minds. Save favorites, build collections, and find daily inspiration.",
  keywords: ["quotes", "inspiration", "wisdom", "motivation", "daily quotes", "philosophy", "entrepreneurs"],
  authors: [{ name: "VibeQuotes" }],
  openGraph: {
    title: "VibeQuotes — Discover Wisdom",
    description: "A cinematic quote discovery experience.",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <QuotesProvider>
                <CollectionsProvider>
                  <MinimalHeader />
                  <main className="flex-1 relative z-10">{children}</main>
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
