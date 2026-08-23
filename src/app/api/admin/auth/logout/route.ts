import { NextResponse } from "next/server";
import { deleteAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  await deleteAdminSessionCookie();
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}
