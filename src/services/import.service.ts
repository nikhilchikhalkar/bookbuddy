import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/Book";
import { ImportHistory } from "@/models/ImportHistory";
import { parseExcelBuffer } from "@/lib/excel";
import { ImportValidator } from "@/validators/import.validator";
import {
  ImportExecutionResult,
  ImportMode,
  ImportPreviewResult,
  RowValidationError,
} from "@/types/import";
import { IBook } from "@/types/book";

export class ImportService {
  /**
   * Parse uploaded Excel buffer and run pre-import validation
   */
  static async parseAndValidate(
    buffer: Buffer,
    fileName: string
  ): Promise<ImportPreviewResult & { detectedColumns: Record<string, string> }> {
    const { rawRows, detectedColumns } = parseExcelBuffer(buffer);
    const validationResult = ImportValidator.validateRows(rawRows, fileName);

    return {
      ...validationResult,
      detectedColumns,
    };
  }

  /**
   * Execute the batch import into MongoDB based on chosen mode
   */
  static async executeImport(params: {
    validBooks: Partial<IBook>[];
    fileName: string;
    mode: ImportMode;
    adminEmail: string;
    previewErrors?: RowValidationError[];
  }): Promise<ImportExecutionResult> {
    const { validBooks, fileName, mode, adminEmail, previewErrors = [] } = params;
    const startedAt = new Date();
    await connectToDatabase();

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let deactivatedCount = 0;
    const executionErrors: RowValidationError[] = [...previewErrors];

    const uploadedBookIds = validBooks
      .map((b) => b.bookId?.trim())
      .filter((id): id is string => Boolean(id));

    if (mode === "ADD") {
      // 1. ADD NEW MODE: Skip existing Book IDs
      const existingBooks = await Book.find({
        bookId: { $in: uploadedBookIds },
      }).select("bookId");

      const existingIdSet = new Set(
        existingBooks.map((b) => b.bookId.toLowerCase())
      );

      const booksToInsert: Partial<IBook>[] = [];

      for (const book of validBooks) {
        if (!book.bookId) continue;
        if (existingIdSet.has(book.bookId.toLowerCase())) {
          skippedCount++;
        } else {
          booksToInsert.push(book);
        }
      }

      if (booksToInsert.length > 0) {
        try {
          const insertResult = await Book.insertMany(booksToInsert, {
            ordered: false,
          });
          insertedCount = insertResult.length;
        } catch (err: unknown) {
          console.error("Partial insertion warning:", err);
          // In unordered insert, successful items are still inserted
          const errorAny = err as { insertedDocs?: unknown[] };
          if (errorAny?.insertedDocs) {
            insertedCount = errorAny.insertedDocs.length;
          }
        }
      }
    } else {
      // 2. REPLACE EXISTING MODE: Source of truth update
      // A. Upsert all valid books in uploaded sheet
      for (const book of validBooks) {
        if (!book.bookId) continue;

        const res = await Book.updateOne(
          { bookId: book.bookId },
          {
            $set: {
              ...book,
              isActive: book.isActive !== undefined ? book.isActive : true,
            },
          },
          { upsert: true }
        );

        if (res.upsertedCount > 0) {
          insertedCount++;
        } else if (res.modifiedCount > 0) {
          updatedCount++;
        }
      }

      // B. Mark active books NOT present in the Excel as inactive
      const deactivationResult = await Book.updateMany(
        {
          bookId: { $nin: uploadedBookIds },
          isActive: true,
        },
        {
          $set: { isActive: false },
        }
      );

      deactivatedCount = deactivationResult.modifiedCount;
    }

    const completedAt = new Date();
    const successfulRows = insertedCount + updatedCount;
    const failedCount = executionErrors.length;
    const status =
      failedCount === 0
        ? "SUCCESS"
        : successfulRows > 0
        ? "PARTIAL"
        : "FAILED";

    // Record in ImportHistory
    const historyDoc = await ImportHistory.create({
      fileName,
      importMode: mode,
      totalRows: validBooks.length,
      successfulRows,
      failedRows: failedCount,
      skippedRows: skippedCount,
      duplicateRows: skippedCount,
      deactivatedRows: deactivatedCount,
      status,
      errors: executionErrors.slice(0, 50), // Store up to top 50 errors in history
      adminEmail,
      startedAt,
      completedAt,
    });

    return {
      importId: historyDoc._id.toString(),
      fileName,
      importMode: mode,
      totalRows: validBooks.length,
      insertedCount,
      updatedCount,
      skippedCount,
      deactivatedCount,
      failedCount,
      status,
      errors: executionErrors,
      completedAt,
    };
  }
}
