import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QuotesProvider } from "@/context/QuotesContext";
import { ToastProvider } from "@/context/ToastContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "VibeQuotes - Discover Inspiring Quotes",
  description:
    "A modern quote discovery app. Search quotes, save favorites, and find inspiration from great minds throughout history.",
  keywords: ["quotes", "inspiration", "wisdom", "motivation", "daily quotes"],
  authors: [{ name: "VibeQuotes" }],
  openGraph: {
    title: "VibeQuotes - Discover Inspiring Quotes",
    description: "Search quotes, save favorites, and find inspiration.",
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
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <ToastProvider>
            <QuotesProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <ToastContainer />
              <KeyboardShortcuts />
            </QuotesProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
