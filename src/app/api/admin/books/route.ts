import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { BookService } from "@/services/book.service";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { z } from "zod";

const createBookSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  buyPrice: z.number().min(0, "Buy price must be non-negative"),
  rentPrice: z.number().min(0).optional(),
  currency: z.string().default("INR"),
  category: z.string().default("General"),
  description: z.string().optional(),
  availableForBuy: z.boolean().default(true),
  availableForRent: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "All";
  const availability = (searchParams.get("availability") || "all") as "all" | "buy" | "rent" | "both";
  const sortBy = (searchParams.get("sortBy") || "newest") as "title" | "author" | "buyPrice" | "rentPrice" | "newest";
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = parseInt(searchParams.get("limit") || "20", 10) || 20;
  const includeInactive = searchParams.get("includeInactive") !== "false";

  try {
    const result = await BookService.getBooks({
      query,
      category,
      availability,
      sortBy,
      page,
      limit,
      includeInactive,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = createBookSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: validated.error.issues[0]?.message || "Invalid book payload" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check duplicate bookId
    const existing = await Book.findOne({ bookId: validated.data.bookId.trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Book with ID "${validated.data.bookId}" already exists.` },
        { status: 409 }
      );
    }

    const newBook = await Book.create({
      ...validated.data,
      bookId: validated.data.bookId.trim(),
      serialNumber: validated.data.serialNumber.trim(),
      title: validated.data.title.trim(),
      author: validated.data.author.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to create book" },
      { status: 500 }
    );
  }
}
