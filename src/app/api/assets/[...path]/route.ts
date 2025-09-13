import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
const assetsDir = path.join(process.cwd(), "assets"); // change to your folder

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const fileName = (await context.params).path.join("/");
    const ext = path.extname(fileName).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const filePath = path.join(assetsDir, fileName);

    console.log(filePath)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": `image/${ext.replace(".", "")}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}