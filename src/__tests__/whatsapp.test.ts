import { describe, it, expect } from "vitest";
import { generateWhatsAppUrl } from "@/lib/whatsapp";
import { IBook } from "@/types/book";

describe("WhatsApp URL Generation", () => {
  const mockBook: IBook = {
    bookId: "BK-1001",
    serialNumber: "101",
    title: "Atomic Habits",
    author: "James Clear",
    buyPrice: 450,
    rentPrice: 100,
    currency: "INR",
    category: "Self-Help",
    availableForBuy: true,
    availableForRent: true,
    isActive: true,
  };

  it("generates a valid BUY message URL with clean phone number", () => {
    const url = generateWhatsAppUrl({
      book: mockBook,
      action: "BUY",
      phoneNumber: "+91 98765-43210",
    });

    expect(url).toContain("https://wa.me/919876543210?text=");
    const textParam = decodeURIComponent(url.split("?text=")[1]);

    expect(textParam).toContain("Hello, I am interested in BUYING this book.");
    expect(textParam).toContain("Title: Atomic Habits");
    expect(textParam).toContain("Author: James Clear");
    expect(textParam).toContain("Book ID: BK-1001");
    expect(textParam).toContain("Serial Number: 101");
    expect(textParam).toContain("Buy Price: ₹450");
  });

  it("generates a valid RENT message URL", () => {
    const url = generateWhatsAppUrl({
      book: mockBook,
      action: "RENT",
      phoneNumber: "919876543210",
    });

    const textParam = decodeURIComponent(url.split("?text=")[1]);
    expect(textParam).toContain("Hello, I am interested in RENTING this book.");
    expect(textParam).toContain("Rent Price: ₹100");
  });

  it("properly encodes special characters in book title and author", () => {
    const specialBook: IBook = {
      ...mockBook,
      title: "C++ & Algorithms: Guide #1 (2024)",
      author: "Bjarne & Friends",
    };

    const url = generateWhatsAppUrl({
      book: specialBook,
      action: "BUY",
      phoneNumber: "919876543210",
    });

    expect(url).not.toContain("C++ & Algorithms"); // Should be URL encoded
    const decoded = decodeURIComponent(url.split("?text=")[1]);
    expect(decoded).toContain("C++ & Algorithms: Guide #1 (2024)");
    expect(decoded).toContain("Bjarne & Friends");
  });
});
