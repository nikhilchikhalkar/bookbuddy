import { ExcelParsedRow, ImportPreviewResult, RowValidationError } from "@/types/import";
import { IBook } from "@/types/book";
import { parseBoolean, parseNumber } from "@/lib/excel";

export class ImportValidator {
  /**
   * Validate raw parsed rows and construct ImportPreviewResult
   */
  static validateRows(
    rows: ExcelParsedRow[],
    fileName: string
  ): ImportPreviewResult {
    const validBooks: Partial<IBook>[] = [];
    const errors: RowValidationError[] = [];
    const seenBookIds = new Set<string>();
    const duplicateBookIds = new Set<string>();

    // Check maximum rows limit (5,000 rows safeguard)
    if (rows.length > 5000) {
      errors.push({
        rowNumber: 0,
        message: `File exceeds maximum limit of 5,000 rows (Found ${rows.length} rows). Please split your file.`,
      });
      return {
        fileName,
        totalRows: rows.length,
        validRowsCount: 0,
        invalidRowsCount: rows.length,
        duplicateBookIds: [],
        validBooks: [],
        errors,
      };
    }

    rows.forEach((row, index) => {
      const rowNumber = index + 2; // Excel 1-based index (Header is row 1)
      let hasError = false;

      // Extract raw values
      const rawBookId = row.bookId !== undefined ? String(row.bookId).trim() : "";
      const rawSerial =
        row.serialNumber !== undefined ? String(row.serialNumber).trim() : "";
      const rawTitle = row.title !== undefined ? String(row.title).trim() : "";
      const rawAuthor = row.author !== undefined ? String(row.author).trim() : "";
      const rawBuyPrice = parseNumber(row.buyPrice);
      const rawRentPrice = parseNumber(row.rentPrice);

      // Check for completely empty row
      const hasAnyValue = Object.values(row).some(
        (v) => v !== undefined && v !== null && String(v).trim() !== ""
      );
      if (!hasAnyValue) {
        return; // Skip blank lines without penalty
      }

      // 1. Validate Book ID
      if (!rawBookId) {
        errors.push({
          rowNumber,
          field: "bookId",
          message: "Book ID is missing.",
        });
        hasError = true;
      } else {
        if (seenBookIds.has(rawBookId.toLowerCase())) {
          duplicateBookIds.add(rawBookId);
          errors.push({
            rowNumber,
            bookId: rawBookId,
            field: "bookId",
            message: `Duplicate Book ID "${rawBookId}" found inside this Excel file.`,
          });
          hasError = true;
        } else {
          seenBookIds.add(rawBookId.toLowerCase());
        }
      }

      // 2. Validate Serial Number
      if (!rawSerial) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "serialNumber",
          message: "Serial number is missing.",
        });
        hasError = true;
      }

      // 3. Validate Title
      if (!rawTitle) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "title",
          message: "Book title is missing.",
        });
        hasError = true;
      }

      // 4. Validate Author
      if (!rawAuthor) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "author",
          message: "Author name is missing.",
        });
        hasError = true;
      }

      // 5. Validate Buy Price
      if (rawBuyPrice === undefined || isNaN(rawBuyPrice) || rawBuyPrice < 0) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "buyPrice",
          message: "Buy Price must be a valid non-negative number.",
        });
        hasError = true;
      }

      // 6. Validate Rent Price if provided
      if (
        row.rentPrice !== undefined &&
        String(row.rentPrice).trim() !== "" &&
        (rawRentPrice === undefined || rawRentPrice < 0)
      ) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "rentPrice",
          message: "Rent Price must be a valid non-negative number.",
        });
        hasError = true;
      }

      // 7. Validate Published Year if provided
      const year = parseNumber(row.publishedYear);
      if (year !== undefined && (year < 1000 || year > 2100)) {
        errors.push({
          rowNumber,
          bookId: rawBookId,
          field: "publishedYear",
          message: `Published year "${year}" is invalid (must be between 1000 and 2100).`,
        });
        hasError = true;
      }

      if (!hasError) {
        const availableForBuy = parseBoolean(row.availableForBuy, true);
        const availableForRent = parseBoolean(
          row.availableForRent,
          rawRentPrice !== undefined && rawRentPrice > 0
        );
        const isActive = parseBoolean(row.isActive, true);

        validBooks.push({
          bookId: rawBookId,
          serialNumber: rawSerial,
          title: rawTitle,
          author: rawAuthor,
          buyPrice: rawBuyPrice!,
          rentPrice: rawRentPrice,
          currency: row.currency ? String(row.currency).trim().toUpperCase() : "INR",
          description: row.description ? String(row.description).trim() : "",
          category: row.category ? String(row.category).trim() : "General",
          isbn: row.isbn ? String(row.isbn).trim() : "",
          publisher: row.publisher ? String(row.publisher).trim() : "",
          publishedYear: year,
          coverImage: row.coverImage ? String(row.coverImage).trim() : "",
          availableForBuy,
          availableForRent,
          isActive,
        });
      }
    });

    return {
      fileName,
      totalRows: rows.length,
      validRowsCount: validBooks.length,
      invalidRowsCount: errors.length,
      duplicateBookIds: Array.from(duplicateBookIds),
      validBooks,
      errors,
    };
  }
}
