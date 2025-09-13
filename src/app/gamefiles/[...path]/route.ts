import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const GAME_FILES_DIR = path.join(process.cwd(), "gamefiles");


  // const userAgent = request.headers.get("user-agent") || "";

  // let deviceType: "Windows" | "Mobile" | "Air" | "Unknown" = "Unknown";
  // if (/Windows/i.test(userAgent)) {
  //   deviceType = "Windows";
  // } else if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
  //   deviceType = "Mobile";
  // } else if (/AdobeAIR/i.test(userAgent)) {
  //   deviceType = "Air";
  // }

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {

    const relativePath = ((await context.params)?.path || "").join("/");

    if (!relativePath.endsWith(".swf")) {
      return Response.json("Not found", { status: 404 });
    }

    const referer = req.headers.get("referer") || "";

    if (!referer) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const filePath = path.join(GAME_FILES_DIR, relativePath);

    // security: prevent path traversal ("../")
    if (!filePath.startsWith(GAME_FILES_DIR)) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const stat = await fs.stat(filePath);

    // read file
    const fileBuffer = await fs.readFile(filePath);

    // convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(fileBuffer);

    // return as application/x-shockwave-flash
    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/x-shockwave-flash",
        "Content-Length": stat.size.toString(),
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch (error) {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }
}
