import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { ImportService } from "@/services/import.service";
import { IBook } from "@/types/book";
import { z } from "zod";

export const dynamic = "force-dynamic";

const executeImportSchema = z.object({
  fileName: z.string().min(1),
  mode: z.enum(["ADD", "REPLACE"]),
  validBooks: z.array(z.record(z.string(), z.unknown())),
  previewErrors: z
    .array(
      z.object({
        rowNumber: z.number(),
        bookId: z.string().optional(),
        field: z.string().optional(),
        message: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Admin login required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const validated = executeImportSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validated.error.issues[0]?.message ||
            "Invalid import execution payload.",
        },
        { status: 400 }
      );
    }

    const { fileName, mode, validBooks, previewErrors } = validated.data;

    const result = await ImportService.executeImport({
      validBooks: validBooks as Partial<IBook>[],
      fileName,
      mode,
      adminEmail: session.email,
      previewErrors,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Excel import execution error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during database import.",
      },
      { status: 500 }
    );
  }
}
