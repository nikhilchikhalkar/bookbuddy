import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { AdminSession } from "@/types/admin";
import { signAdminToken } from "@/lib/auth";

// Basic in-memory rate limiting for login attempts
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 6;
const LOCKOUT_PERIOD_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOCKOUT_PERIOD_MS });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

function resetRateLimit(key: string): void {
  loginAttempts.delete(key);
}

export class AuthService {
  /**
   * Authenticate admin credentials and generate session token
   */
  static async login(
    email: string,
    passwordPlain: string,
    clientIp: string = "unknown"
  ): Promise<{ token: string; session: AdminSession }> {
    const rateLimitKey = `login:${clientIp}:${email.toLowerCase().trim()}`;
    const isAllowed = checkRateLimit(rateLimitKey);

    if (!isAllowed) {
      throw new Error("Too many login attempts. Please try again in 10 minutes.");
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      // Intentionally generic error to prevent user enumeration
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(passwordPlain, admin.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    // Success - reset attempts
    resetRateLimit(rateLimitKey);

    // Update lastLoginAt
    admin.lastLoginAt = new Date();
    await admin.save();

    const session: AdminSession = {
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const token = await signAdminToken(session);

    return { token, session };
  }
}
