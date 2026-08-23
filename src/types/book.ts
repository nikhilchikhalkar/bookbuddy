export interface IBook {
  _id?: string;
  bookId: string;
  serialNumber: string;
  title: string;
  author: string;
  buyPrice: number;
  rentPrice?: number;
  currency: string;
  description?: string;
  category?: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  coverImage?: string;
  availableForBuy: boolean;
  availableForRent: boolean;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BookFilterParams {
  query?: string;
  category?: string;
  availability?: "all" | "buy" | "rent" | "both";
  sortBy?: "title" | "author" | "buyPrice" | "rentPrice" | "newest";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface PaginatedBooksResult {
  books: IBook[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
