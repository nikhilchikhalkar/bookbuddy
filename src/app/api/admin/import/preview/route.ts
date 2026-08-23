import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { ImportService } from "@/services/import.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file was uploaded." },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const lowerName = fileName.toLowerCase();

    if (!lowerName.endsWith(".xlsx") && !lowerName.endsWith(".xls")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported file format. Please upload an Excel (.xlsx or .xls) file.",
        },
        { status: 400 }
      );
    }

    // 10MB file size limit safeguard
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const preview = await ImportService.parseAndValidate(buffer, fileName);

    return NextResponse.json({
      success: true,
      preview,
    });
  } catch (error) {
    console.error("Excel preview error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while parsing the Excel file.",
      },
      { status: 500 }
    );
  }
}
