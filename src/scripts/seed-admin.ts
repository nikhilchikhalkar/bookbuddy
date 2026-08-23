import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";

async function seedAdmin() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "book_marketplace";
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "admin123456";

  if (!mongoUri) {
    console.error("❌ MONGODB_URI is not set in environment or .env.local");
    process.exit(1);
  }

  console.log(`Connecting to MongoDB (${dbName})...`);
  await mongoose.connect(mongoUri, { dbName });

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.name = "Store Administrator";
      await existingAdmin.save();
      console.log(`✅ Admin account updated for: ${email}`);
    } else {
      await Admin.create({
        email,
        passwordHash,
        name: "Store Administrator",
        role: "admin",
      });
      console.log(`✅ Admin account created for: ${email}`);
    }

    console.log("🔒 Password successfully hashed with bcrypt and saved.");
  } catch (error) {
    console.error("❌ Failed to seed admin:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAdmin();
