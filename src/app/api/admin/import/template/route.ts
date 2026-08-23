import { NextResponse } from "next/server";
import { generateSampleExcelBuffer } from "@/lib/excel";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const buffer = generateSampleExcelBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="bookbuddy_inventory_template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate template" },
      { status: 500 }
    );
  }
}
