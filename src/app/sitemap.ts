import { MetadataRoute } from "next";
import { BookService } from "@/services/book.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let bookUrls: MetadataRoute.Sitemap = [];

  try {
    const { books } = await BookService.getBooks({ limit: 1000 });
    bookUrls = books.map((book) => ({
      url: `${baseUrl}/books/${encodeURIComponent(book.bookId)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Sitemap books fetch error:", err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/books`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...bookUrls,
  ];
}
