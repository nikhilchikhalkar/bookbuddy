import mongoose, { Schema, Model } from "mongoose";
import { IImportHistory } from "@/types/import";

const RowValidationErrorSchema = new Schema(
  {
    rowNumber: { type: Number, required: true },
    bookId: { type: String, default: "" },
    field: { type: String, default: "" },
    message: { type: String, required: true },
  },
  { _id: false }
);

const ImportHistorySchema = new Schema<IImportHistory>(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    importMode: {
      type: String,
      enum: ["ADD", "REPLACE"],
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
      default: 0,
    },
    successfulRows: {
      type: Number,
      required: true,
      default: 0,
    },
    failedRows: {
      type: Number,
      required: true,
      default: 0,
    },
    skippedRows: {
      type: Number,
      required: true,
      default: 0,
    },
    duplicateRows: {
      type: Number,
      required: true,
      default: 0,
    },
    deactivatedRows: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PARTIAL"],
      required: true,
      default: "SUCCESS",
    },
    errors: [RowValidationErrorSchema],
    adminEmail: {
      type: String,
      required: true,
      trim: true,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

ImportHistorySchema.index({ createdAt: -1 });

export const ImportHistory: Model<IImportHistory> =
  mongoose.models.ImportHistory ||
  mongoose.model<IImportHistory>("ImportHistory", ImportHistorySchema);
