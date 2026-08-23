import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { BookFilterParams, IBook, PaginatedBooksResult } from "@/types/book";
import { SortOrder } from "mongoose";

export class BookService {
  /**
   * Fetch paginated list of books with search and filters
   */
  static async getBooks(params: BookFilterParams): Promise<PaginatedBooksResult> {
    await connectToDatabase();

    const {
      query,
      category,
      availability = "all",
      sortBy = "newest",
      sortOrder = "desc",
      page = 1,
      limit = 12,
      includeInactive = false,
    } = params;

    const validatedPage = Math.max(1, Number(page) || 1);
    const validatedLimit = Math.min(100, Math.max(1, Number(limit) || 12));
    const skip = (validatedPage - 1) * validatedLimit;

    const filter: Record<string, unknown> = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (availability === "buy") {
      filter.availableForBuy = true;
    } else if (availability === "rent") {
      filter.availableForRent = true;
    } else if (availability === "both") {
      filter.availableForBuy = true;
      filter.availableForRent = true;
    }

    if (query && query.trim() !== "") {
      const trimmedQuery = query.trim();
      const regex = new RegExp(trimmedQuery, "i");
      filter.$or = [
        { title: regex },
        { author: regex },
        { bookId: regex },
        { serialNumber: regex },
        { category: regex },
      ];
    }

    const sortOptions: { [key: string]: SortOrder } = {};
    const order: SortOrder = sortOrder === "asc" ? 1 : -1;

    switch (sortBy) {
      case "title":
        sortOptions.title = order;
        break;
      case "author":
        sortOptions.author = order;
        break;
      case "buyPrice":
        sortOptions.buyPrice = order;
        break;
      case "rentPrice":
        sortOptions.rentPrice = order;
        break;
      case "newest":
      default:
        sortOptions.createdAt = order;
        break;
    }

    const [booksRaw, total] = await Promise.all([
      Book.find(filter).sort(sortOptions).skip(skip).limit(validatedLimit).lean(),
      Book.countDocuments(filter),
    ]);

    const books: IBook[] = booksRaw.map((doc) => ({
      _id: doc._id.toString(),
      bookId: doc.bookId,
      serialNumber: doc.serialNumber,
      title: doc.title,
      author: doc.author,
      buyPrice: doc.buyPrice,
      rentPrice: doc.rentPrice,
      currency: doc.currency || "INR",
      description: doc.description,
      category: doc.category || "General",
      isbn: doc.isbn,
      publisher: doc.publisher,
      publishedYear: doc.publishedYear,
      coverImage: doc.coverImage,
      availableForBuy: doc.availableForBuy,
      availableForRent: doc.availableForRent,
      isActive: doc.isActive,
      createdAt: doc.createdAt?.toString(),
      updatedAt: doc.updatedAt?.toString(),
    }));

    const totalPages = Math.ceil(total / validatedLimit) || 1;

    return {
      books,
      total,
      page: validatedPage,
      limit: validatedLimit,
      totalPages,
      hasNextPage: validatedPage < totalPages,
      hasPrevPage: validatedPage > 1,
    };
  }

  /**
   * Get single book by its human-readable bookId
   */
  static async getBookByBookId(
    bookId: string,
    includeInactive = false
  ): Promise<IBook | null> {
    await connectToDatabase();

    const query: Record<string, unknown> = { bookId };
    if (!includeInactive) {
      query.isActive = true;
    }

    const doc = await Book.findOne(query).lean();
    if (!doc) return null;

    return {
      _id: doc._id.toString(),
      bookId: doc.bookId,
      serialNumber: doc.serialNumber,
      title: doc.title,
      author: doc.author,
      buyPrice: doc.buyPrice,
      rentPrice: doc.rentPrice,
      currency: doc.currency || "INR",
      description: doc.description,
      category: doc.category || "General",
      isbn: doc.isbn,
      publisher: doc.publisher,
      publishedYear: doc.publishedYear,
      coverImage: doc.coverImage,
      availableForBuy: doc.availableForBuy,
      availableForRent: doc.availableForRent,
      isActive: doc.isActive,
      createdAt: doc.createdAt?.toString(),
      updatedAt: doc.updatedAt?.toString(),
    };
  }

  /**
   * Get distinct categories
   */
  static async getCategories(): Promise<string[]> {
    await connectToDatabase();
    const categories = await Book.distinct("category", { isActive: true });
    return categories.filter((c) => Boolean(c) && typeof c === "string").sort();
  }

  /**
   * Get inventory statistics for admin dashboard
   */
  static async getInventoryStats() {
    await connectToDatabase();

    const [
      totalBooks,
      activeBooks,
      availableForBuy,
      availableForRent,
      bothAvailable,
    ] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ isActive: true }),
      Book.countDocuments({ isActive: true, availableForBuy: true }),
      Book.countDocuments({ isActive: true, availableForRent: true }),
      Book.countDocuments({
        isActive: true,
        availableForBuy: true,
        availableForRent: true,
      }),
    ]);

    return {
      totalBooks,
      activeBooks,
      inactiveBooks: totalBooks - activeBooks,
      availableForBuy,
      availableForRent,
      bothAvailable,
    };
  }

  /**
   * Update book by bookId
   */
  static async updateBook(
    bookId: string,
    updateData: Partial<IBook>
  ): Promise<IBook | null> {
    await connectToDatabase();

    const updated = await Book.findOneAndUpdate(
      { bookId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return null;

    return {
      _id: updated._id.toString(),
      bookId: updated.bookId,
      serialNumber: updated.serialNumber,
      title: updated.title,
      author: updated.author,
      buyPrice: updated.buyPrice,
      rentPrice: updated.rentPrice,
      currency: updated.currency,
      description: updated.description,
      category: updated.category,
      isbn: updated.isbn,
      publisher: updated.publisher,
      publishedYear: updated.publishedYear,
      coverImage: updated.coverImage,
      availableForBuy: updated.availableForBuy,
      availableForRent: updated.availableForRent,
      isActive: updated.isActive,
      createdAt: updated.createdAt?.toString(),
      updatedAt: updated.updatedAt?.toString(),
    };
  }
}
