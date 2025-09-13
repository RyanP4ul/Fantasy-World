import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await context.params)?.userId;
    const filePath = path.join(process.cwd(), "gamefiles/characters", `${userId}.png`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "Character image not found" },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: number }> }
) {
try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType !== "image/png") {
      return NextResponse.json(
        { error: "Only image/png is allowed" },
        { status: 400 }
      );
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxSize = 3 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max 3MB allowed." },
        { status: 400 }
      );
    }

    const userId = (await context.params)?.userId || -1;
    const uploadDir = path.join(process.cwd(), "gamefiles/characters");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, `${userId}.png`);

    // If old file exists, delete it
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      // No old file, ignore
    }

    // Save the new file
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "Character image saved successfully",
      userId,
      path: `/uploads/characters/${userId}.png`,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
