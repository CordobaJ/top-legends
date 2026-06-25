import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";

const useCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "Archivo requerido" }, { status: 400 });
    }

    if (useCloudinary) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      try {
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "top-legends/products",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1200, height: 1200, crop: "limit" },
          ],
        });

        return NextResponse.json({
          success: true,
          data: { url: result.secure_url, publicId: result.public_id },
        });
      } catch (cloudErr) {
        const msg = cloudErr instanceof Error ? cloudErr.message : String(cloudErr);
        return NextResponse.json({ success: false, error: "Cloudinary: " + msg }, { status: 500 });
      }
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const dir = join(process.cwd(), "public", "images", "products");
    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, fileName), buffer);

    return NextResponse.json({
      success: true,
      data: { url: `/images/products/${fileName}`, publicId: fileName },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: "Error al subir imagen: " + msg }, { status: 500 });
  }
}
