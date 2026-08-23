import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AdminSession } from "@/types/admin";
import { getEnv } from "./env";

export const ADMIN_COOKIE_NAME = "admin_session_token";
const SESSION_EXPIRATION = "24h";

function getSecretKey(): Uint8Array {
  const env = getEnv();
  return new TextEncoder().encode(env.AUTH_SECRET);
}

/**
 * Sign JWT token for authenticated admin
 */
export async function signAdminToken(session: AdminSession): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({
    adminId: session.adminId,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(secretKey);
}

/**
 * Verify JWT token and extract AdminSession
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSession | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);

    if (
      !payload ||
      typeof payload.adminId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      email: payload.email,
      name: (payload.name as string) || "Administrator",
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

/**
 * Read and verify admin session from HTTP-only cookie
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Set HTTP-only secure cookie
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Delete admin session cookie on logout
 */
export async function deleteAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
