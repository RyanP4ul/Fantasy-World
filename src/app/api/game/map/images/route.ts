import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { hasImage, setHasImage } from "@/features/areas/areas";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      console.log("Invalid content type:", contentType);
      return NextResponse.json(
        { error: "Expected application/json body." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { id, name, parts } = body;

    if (!name || !parts || !Array.isArray(parts)) {
      console.log("Invalid body:", body);
      return NextResponse.json(
        { error: "Missing name or parts array." },
        { status: 400 }
      );
    }

    if (!hasImage(id)) {
      return NextResponse.json("hi");
    }

    const uploadDir = path.join(process.cwd(), "assets/game/maps", name);
    await fs.mkdir(uploadDir, { recursive: true });

    const savedFiles: string[] = [];

    for (const frame of parts) {
      const { name, image } = frame;

      if (!name || !image) continue;

      const buffer = Buffer.from(image, "base64");

      if (buffer.length > 10 * 1024 * 1024) {
        console.log(`Image ${name} too large: ${buffer.length} bytes`);
        return NextResponse.json(
          { error: `Image ${name} too large (max 10MB).` },
          { status: 400 }
        );
      }

      const filePath = path.join(uploadDir, `${name}.png`);
      await fs.writeFile(filePath, buffer);
      savedFiles.push(`${name}/${name}.png`);
    }

    await setHasImage(id, true);

    return NextResponse.json("ok");
  } catch (err: any) {
    console.error("Failed to upload map frames:", err);
    return NextResponse.json(
      { error: "Failed to save map images" },
      { status: 500 }
    );
  }
}
