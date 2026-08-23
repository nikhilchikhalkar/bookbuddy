import { describe, it, expect } from "vitest";
import { ImportValidator } from "@/validators/import.validator";
import { ExcelParsedRow } from "@/types/import";

describe("Excel ImportValidator", () => {
  it("validates well-formed rows successfully", () => {
    const rows: ExcelParsedRow[] = [
      {
        serialNumber: "1",
        bookId: "BK-1001",
        title: "Clean Architecture",
        author: "Robert C. Martin",
        buyPrice: 500,
        rentPrice: 120,
      },
      {
        serialNumber: "2",
        bookId: "BK-1002",
        title: "Refactoring",
        author: "Martin Fowler",
        buyPrice: 600,
      },
    ];

    const result = ImportValidator.validateRows(rows, "test.xlsx");
    expect(result.validRowsCount).toBe(2);
    expect(result.invalidRowsCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("catches missing required fields", () => {
    const rows: ExcelParsedRow[] = [
      {
        serialNumber: "",
        bookId: "",
        title: "",
        author: "",
        buyPrice: "invalid_price",
      },
    ];

    const result = ImportValidator.validateRows(rows, "test.xlsx");
    expect(result.validRowsCount).toBe(0);
    expect(result.invalidRowsCount).toBeGreaterThanOrEqual(4);
    expect(result.errors.some((e) => e.message.includes("Book ID is missing"))).toBe(true);
    expect(result.errors.some((e) => e.message.includes("Title is missing") || e.message.includes("title is missing"))).toBe(true);
    expect(result.errors.some((e) => e.message.includes("Buy Price must be a valid"))).toBe(true);
  });

  it("detects in-file duplicate Book IDs", () => {
    const rows: ExcelParsedRow[] = [
      {
        serialNumber: "1",
        bookId: "BK-1001",
        title: "Book One",
        author: "Author A",
        buyPrice: 300,
      },
      {
        serialNumber: "2",
        bookId: "BK-1001", // Duplicate
        title: "Book Two",
        author: "Author B",
        buyPrice: 400,
      },
    ];

    const result = ImportValidator.validateRows(rows, "duplicates.xlsx");
    expect(result.duplicateBookIds).toContain("BK-1001");
    expect(result.validRowsCount).toBe(1);
    expect(result.invalidRowsCount).toBe(1);
    expect(result.errors[0].message).toContain("Duplicate Book ID");
  });
});
