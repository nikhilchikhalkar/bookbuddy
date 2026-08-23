import { IBook } from "./book";

export type ImportMode = "ADD" | "REPLACE";
export type ImportStatus = "SUCCESS" | "FAILED" | "PARTIAL";

export interface RowValidationError {
  rowNumber: number;
  bookId?: string;
  field?: string;
  message: string;
}

export interface ExcelParsedRow {
  serialNumber?: string | number;
  bookId?: string;
  title?: string;
  author?: string;
  buyPrice?: string | number;
  rentPrice?: string | number;
  currency?: string;
  description?: string;
  category?: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: string | number;
  coverImage?: string;
  availableForBuy?: boolean | string | number;
  availableForRent?: boolean | string | number;
  isActive?: boolean | string | number;
  [key: string]: unknown;
}

export interface ImportPreviewResult {
  fileName: string;
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  duplicateBookIds: string[];
  validBooks: Partial<IBook>[];
  errors: RowValidationError[];
}

export interface ImportExecutionResult {
  importId: string;
  fileName: string;
  importMode: ImportMode;
  totalRows: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  deactivatedCount: number;
  failedCount: number;
  status: ImportStatus;
  errors: RowValidationError[];
  completedAt: Date;
}

export interface IImportHistory {
  _id?: string;
  fileName: string;
  importMode: ImportMode;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  skippedRows: number;
  duplicateRows: number;
  deactivatedRows?: number;
  status: ImportStatus;
  errors: RowValidationError[];
  adminEmail: string;
  startedAt: Date;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
