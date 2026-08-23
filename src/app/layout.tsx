import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookBuddy • Buy & Rent Books Instantly via WhatsApp",
    template: "%s | BookBuddy",
  },
  description:
    "Explore thousands of curated books to Buy or Rent. Zero signup required — order directly through WhatsApp in seconds.",
  keywords: ["books", "buy books", "rent books", "online bookstore", "whatsapp bookstore", "book marketplace"],
  authors: [{ name: "BookBuddy Marketplace" }],
  openGraph: {
    title: "BookBuddy • Buy & Rent Books Instantly",
    description: "Browse, Buy, or Rent books directly through WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
