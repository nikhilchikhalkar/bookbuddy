import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { setAdminSessionCookie } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error.issues[0]?.message || "Invalid inputs",
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { token, session } = await AuthService.login(email, password, ip);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      admin: session,
    });
  } catch (error) {
    console.error("Admin login API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Authentication failed";
    const status =
      errorMessage === "Invalid email or password"
        ? 401
        : errorMessage.includes("Too many")
        ? 429
        : 500;

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status }
    );
  }
}
