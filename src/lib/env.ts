import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("book_marketplace"),
  AUTH_SECRET: z.string().min(6, "AUTH_SECRET must be at least 6 characters").default("default_auth_secret_key_12345"),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email").default("admin@example.com"),
  ADMIN_PASSWORD: z.string().min(6, "ADMIN_PASSWORD must be at least 6 characters").default("admin123456"),
  WHATSAPP_NUMBER: z
    .string()
    .min(10, "WHATSAPP_NUMBER must be at least 10 digits")
    .default("919876543210"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const authSecretRaw = process.env.AUTH_SECRET?.trim();
  const authSecret =
    authSecretRaw && authSecretRaw.length >= 6
      ? authSecretRaw
      : "default_auth_secret_key_12345";

  const appUrlRaw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const appUrl =
    appUrlRaw && appUrlRaw.startsWith("http")
      ? appUrlRaw
      : "http://localhost:3000";

  const whatsappRaw = (process.env.WHATSAPP_NUMBER || "919876543210").replace(/[^0-9]/g, "");
  const whatsappNumber = whatsappRaw.length >= 10 ? whatsappRaw : "919876543210";

  const result = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/book_marketplace",
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "book_marketplace",
    AUTH_SECRET: authSecret,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123456",
    WHATSAPP_NUMBER: whatsappNumber,
    NEXT_PUBLIC_APP_URL: appUrl,
  });

  if (!result.success) {
    console.error("❌ Environment validation error:", result.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return result.data;
}
