import * as XLSX from "xlsx";
import { ExcelParsedRow } from "@/types/import";
import { IBook } from "@/types/book";

// Column mapping aliases dictionary (lowercase normalized)
const COLUMN_ALIASES: Record<keyof IBook, string[]> = {
  serialNumber: [
    "sr number",
    "sr no",
    "sr.",
    "sr_number",
    "serial number",
    "serial no",
    "serial",
    "s.no",
    "s no",
  ],
  bookId: ["book id", "bookid", "book_id", "book code", "code", "id"],
  title: ["title", "book title", "book_title", "name", "book name"],
  author: ["author", "book author", "book_author", "writer", "authors"],
  buyPrice: [
    "buy price",
    "buy_price",
    "buyprice",
    "purchase price",
    "price",
    "mrp",
    "cost",
  ],
  rentPrice: [
    "rent price",
    "rent_price",
    "rentprice",
    "rental price",
    "rent",
    "rental fee",
  ],
  currency: ["currency", "curr", "symbol"],
  description: ["description", "desc", "summary", "about", "details"],
  category: ["category", "genre", "subject", "topic"],
  isbn: ["isbn", "isbn13", "isbn10", "isbn number"],
  publisher: ["publisher", "publication", "publishing house"],
  publishedYear: [
    "published year",
    "published_year",
    "year",
    "pub year",
    "publish year",
    "edition year",
  ],
  coverImage: ["cover image", "cover_image", "image", "image url", "photo"],
  availableForBuy: [
    "available for buy",
    "available_for_buy",
    "buy available",
    "allow buy",
    "can buy",
  ],
  availableForRent: [
    "available for rent",
    "available_for_rent",
    "rent available",
    "allow rent",
    "can rent",
  ],
  isActive: ["active", "is active", "is_active", "status", "enabled"],
  _id: [],
  createdAt: [],
  updatedAt: [],
};

/**
 * Normalize raw column name to standardized field name
 */
export function normalizeColumnName(rawHeader: string): keyof IBook | null {
  if (!rawHeader || typeof rawHeader !== "string") return null;
  const cleaned = rawHeader.toLowerCase().trim().replace(/[\s_-]+/g, " ");

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(cleaned) || field.toLowerCase() === cleaned) {
      return field as keyof IBook;
    }
  }

  return null;
}

/**
 * Safely parse boolean values from various formats (TRUE, FALSE, 1, 0, Yes, No)
 */
export function parseBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  const str = String(value).trim().toLowerCase();
  if (["true", "yes", "y", "1", "t"].includes(str)) return true;
  if (["false", "no", "n", "0", "f"].includes(str)) return false;

  return defaultValue;
}

/**
 * Safely parse price/number
 */
export function parseNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number") return isNaN(value) ? undefined : value;

  // Clean currency symbols and commas e.g. "₹ 450.00" -> 450
  const cleaned = String(value).replace(/[^0-9.-]/g, "").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

/**
 * Parse an Excel file Buffer into structured JSON rows with detected column mapping
 */
export function parseExcelBuffer(buffer: Buffer): {
  rawRows: ExcelParsedRow[];
  detectedColumns: Record<string, string>;
} {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("The uploaded Excel workbook contains no worksheets.");
  }

  const sheet = workbook.Sheets[sheetName];
  const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  if (jsonData.length === 0) {
    return { rawRows: [], detectedColumns: {} };
  }

  // Detect column mapping from the first row's keys
  const rawHeaders = Object.keys(jsonData[0]);
  const detectedColumns: Record<string, string> = {};
  const headerMap: Record<string, keyof IBook> = {};

  for (const header of rawHeaders) {
    const normalizedKey = normalizeColumnName(header);
    if (normalizedKey) {
      detectedColumns[header] = normalizedKey;
      headerMap[header] = normalizedKey;
    }
  }

  const rawRows: ExcelParsedRow[] = jsonData.map((row) => {
    const mappedRow: Record<string, unknown> = {};
    for (const [rawHeader, val] of Object.entries(row)) {
      const fieldKey = headerMap[rawHeader];
      if (fieldKey) {
        mappedRow[fieldKey] = val;
      } else {
        mappedRow[rawHeader] = val;
      }
    }
    return mappedRow as ExcelParsedRow;
  });

  return { rawRows, detectedColumns };
}

/**
 * Generate a sample downloadable Excel workbook template
 */
export function generateSampleExcelBuffer(): Buffer {
  const sampleData = [
    {
      "Sr Number": 1,
      "Book ID": "BK-1001",
      Title: "Atomic Habits",
      Author: "James Clear",
      "Buy Price": 450,
      "Rent Price": 99,
      Currency: "INR",
      Category: "Self-Help",
      ISBN: "9781847941831",
      Publisher: "Penguin Random House",
      "Published Year": 2018,
      Description: "An easy and proven way to build good habits and break bad ones.",
      "Available For Buy": "Yes",
      "Available For Rent": "Yes",
      Active: "Yes",
    },
    {
      "Sr Number": 2,
      "Book ID": "BK-1002",
      Title: "The Psychology of Money",
      Author: "Morgan Housel",
      "Buy Price": 399,
      "Rent Price": 80,
      Currency: "INR",
      Category: "Finance",
      ISBN: "9789390166268",
      Publisher: "Jaico Publishing",
      "Published Year": 2020,
      Description: "Timeless lessons on wealth, greed, and happiness.",
      "Available For Buy": "Yes",
      "Available For Rent": "Yes",
      Active: "Yes",
    },
    {
      "Sr Number": 3,
      "Book ID": "BK-1003",
      Title: "Clean Code",
      Author: "Robert C. Martin",
      "Buy Price": 650,
      "Rent Price": 150,
      Currency: "INR",
      Category: "Programming",
      ISBN: "9780132350884",
      Publisher: "Prentice Hall",
      "Published Year": 2008,
      Description: "A Handbook of Agile Software Craftsmanship.",
      "Available For Buy": "Yes",
      "Available For Rent": "Yes",
      Active: "Yes",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Books Inventory");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
}
