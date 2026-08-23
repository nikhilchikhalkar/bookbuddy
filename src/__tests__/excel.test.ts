import { describe, it, expect } from "vitest";
import { normalizeColumnName, parseBoolean, parseNumber } from "@/lib/excel";

describe("Excel Column and Value Normalization", () => {
  it("normalizes case and common aliases for columns", () => {
    expect(normalizeColumnName("Book ID")).toBe("bookId");
    expect(normalizeColumnName("BOOK_ID")).toBe("bookId");
    expect(normalizeColumnName("Sr Number")).toBe("serialNumber");
    expect(normalizeColumnName("sr no")).toBe("serialNumber");
    expect(normalizeColumnName("Book Title")).toBe("title");
    expect(normalizeColumnName("Author")).toBe("author");
    expect(normalizeColumnName("Buy Price")).toBe("buyPrice");
    expect(normalizeColumnName("Rent Price")).toBe("rentPrice");
    expect(normalizeColumnName("Available For Rent")).toBe("availableForRent");
  });

  it("safely parses boolean representations", () => {
    expect(parseBoolean("TRUE", false)).toBe(true);
    expect(parseBoolean("yes", false)).toBe(true);
    expect(parseBoolean("1", false)).toBe(true);
    expect(parseBoolean(1, false)).toBe(true);
    expect(parseBoolean("FALSE", true)).toBe(false);
    expect(parseBoolean("no", true)).toBe(false);
    expect(parseBoolean("0", true)).toBe(false);
    expect(parseBoolean("", true)).toBe(true); // default fallback
  });

  it("safely parses number and price values with symbols", () => {
    expect(parseNumber(450)).toBe(450);
    expect(parseNumber("450")).toBe(450);
    expect(parseNumber("₹ 450.50")).toBe(450.5);
    expect(parseNumber("invalid")).toBeUndefined();
    expect(parseNumber("")).toBeUndefined();
  });
});
