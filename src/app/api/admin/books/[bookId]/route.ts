import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { BookService } from "@/services/book.service";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";

interface RouteParams {
  params: Promise<{
    bookId: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  const decodedId = decodeURIComponent(bookId);

  try {
    const updateData = await req.json();
    const updatedBook = await BookService.updateBook(decodedId, updateData);

    if (!updatedBook) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  const decodedId = decodeURIComponent(bookId);

  try {
    await connectToDatabase();
    const book = await Book.findOne({ bookId: decodedId });

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    // Soft delete / Toggle active status
    book.isActive = !book.isActive;
    await book.save();

    return NextResponse.json({
      success: true,
      message: `Book ${book.isActive ? "reactivated" : "deactivated"} successfully`,
      isActive: book.isActive,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to modify book" },
      { status: 500 }
    );
  }
}
