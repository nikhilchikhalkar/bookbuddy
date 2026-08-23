import { IBook } from "@/types/book";
import { formatPrice } from "./utils";

export type WhatsAppAction = "BUY" | "RENT";

export interface WhatsAppMessageOptions {
  book: Pick<
    IBook,
    | "title"
    | "author"
    | "bookId"
    | "serialNumber"
    | "buyPrice"
    | "rentPrice"
    | "currency"
    | "category"
  >;
  action: WhatsAppAction;
  phoneNumber?: string;
}

/**
 * Generates a pre-filled, URL-encoded WhatsApp click-to-chat URL.
 */
export function generateWhatsAppUrl({
  book,
  action,
  phoneNumber,
}: WhatsAppMessageOptions): string {
  // Use passed phoneNumber or environment variable (fallback if browser-side)
  const rawNumber =
    phoneNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    "919876543210";

  // Clean phone number (strip +, spaces, hyphens, parentheses)
  const cleanNumber = rawNumber.replace(/[^0-9]/g, "");

  const actionText = action === "BUY" ? "BUYING" : "RENTING";
  const buyPriceFormatted = formatPrice(book.buyPrice, book.currency);
  const rentPriceFormatted =
    book.rentPrice !== undefined
      ? formatPrice(book.rentPrice, book.currency)
      : "Not available for rent";

  const messageLines = [
    `Hello, I am interested in ${actionText} this book.`,
    ``,
    `📚 Book Details:`,
    `• Title: ${book.title}`,
    `• Author: ${book.author}`,
    `• Book ID: ${book.bookId}`,
    `• Serial Number: ${book.serialNumber}`,
    `• Buy Price: ${buyPriceFormatted}`,
    `• Rent Price: ${rentPriceFormatted}`,
  ];

  if (book.category && book.category !== "General") {
    messageLines.push(`• Category: ${book.category}`);
  }

  messageLines.push(``, `Please let me know the next steps.`);

  const message = messageLines.join("\n");
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
