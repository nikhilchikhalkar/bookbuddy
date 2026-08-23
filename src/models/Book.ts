import mongoose, { Schema, Model } from "mongoose";
import { IBook } from "@/types/book";

const BookSchema = new Schema<IBook>(
  {
    bookId: {
      type: String,
      required: [true, "Book ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      index: true,
    },
    buyPrice: {
      type: Number,
      required: [true, "Buy price is required"],
      min: [0, "Buy price must be non-negative"],
    },
    rentPrice: {
      type: Number,
      default: undefined,
      min: [0, "Rent price must be non-negative"],
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
      index: true,
    },
    isbn: {
      type: String,
      trim: true,
      default: "",
    },
    publisher: {
      type: String,
      trim: true,
      default: "",
    },
    publishedYear: {
      type: Number,
      default: undefined,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    availableForBuy: {
      type: Boolean,
      default: true,
    },
    availableForRent: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast search & filtering
BookSchema.index({ title: "text", author: "text", description: "text" });
BookSchema.index({ isActive: 1, availableForBuy: 1, availableForRent: 1 });
BookSchema.index({ category: 1, isActive: 1 });

export const Book: Model<IBook> =
  mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);
