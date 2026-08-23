import mongoose, { Schema, Model } from "mongoose";
import { IAdmin } from "@/types/admin";

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      default: "Store Administrator",
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
