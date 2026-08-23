import { z } from "zod";

const DEFAULT_MONGODB_URI =
  "mongodb+srv://unikpatner_db_user:pjWqAozi9D3718mX@cluster0.9ut9ek3.mongodb.net/?appName=Cluster0";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("bookbuddy"),
  AUTH_SECRET: z
    .string()
    .min(6, "AUTH_SECRET must be at least 6 characters")
    .default("bookbuddy_secure_jwt_secret_key_2026"),
  ADMIN_EMAIL: z
    .string()
    .email("ADMIN_EMAIL must be a valid email")
    .default("smbembalkar.96@gmail.com"),
  ADMIN_PASSWORD: z
    .string()
    .min(6, "ADMIN_PASSWORD must be at least 6 characters")
    .default("sanjay3176"),
  WHATSAPP_NUMBER: z
    .string()
    .min(10, "WHATSAPP_NUMBER must be at least 10 digits")
    .default("919420076827"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const mongoUriRaw = process.env.MONGODB_URI?.trim();
  const mongoUri =
    mongoUriRaw && mongoUriRaw.length > 0 ? mongoUriRaw : DEFAULT_MONGODB_URI;

  const authSecretRaw = process.env.AUTH_SECRET?.trim();
  const authSecret =
    authSecretRaw && authSecretRaw.length >= 6
      ? authSecretRaw
      : "bookbuddy_secure_jwt_secret_key_2026";

  const appUrlRaw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const appUrl =
    appUrlRaw && appUrlRaw.startsWith("http")
      ? appUrlRaw
      : "http://localhost:3000";

  const whatsappRaw = (
    process.env.WHATSAPP_NUMBER || "919420076827"
  ).replace(/[^0-9]/g, "");
  const whatsappNumber =
    whatsappRaw.length >= 10 ? whatsappRaw : "919420076827";

  const result = envSchema.safeParse({
    MONGODB_URI: mongoUri,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "bookbuddy",
    AUTH_SECRET: authSecret,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "smbembalkar.96@gmail.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "sanjay3176",
    WHATSAPP_NUMBER: whatsappNumber,
    NEXT_PUBLIC_APP_URL: appUrl,
  });

  if (!result.success) {
    console.error(
      "❌ Environment validation error:",
      result.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return result.data;
}
