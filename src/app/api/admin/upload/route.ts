import { NextRequest } from "next/server";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";
import { fail, ok, requireAdmin } from "@/lib/api";

const uploadSchema = z.object({
  file: z.string().min(1),
  folder: z.string().min(1).default("products"),
});

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const parsed = uploadSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    const result = await uploadImage(parsed.data.file, parsed.data.folder);
    return ok(result, { status: 201 });
  } catch (error) {
    console.error("Admin upload error:", error);
    return fail("Failed to upload image", 500);
  }
}
