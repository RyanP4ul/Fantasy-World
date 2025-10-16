import { is } from 'drizzle-orm';
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import getDeviceType from "@/lib/user-agent";
import { isProduction } from '@/lib/utils';

const GAME_FILES_DIR = path.join(process.cwd(), "gamefiles");

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {

    const deviceType = getDeviceType(req);
    const relativePath = ((await context.params)?.path || "").join("/");

    if (!(relativePath.endsWith(".swf") || relativePath.endsWith(".mp3"))) {
      return Response.json("Not found", { status: 404 });
    }

/*
    const referer = req.headers.get("referer") || "";

    if (!referer || isProduction() && (deviceType === "Unknown" || deviceType === "Windows")) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }
	*/

    const filePath = path.join(GAME_FILES_DIR, relativePath);

    if (!filePath.startsWith(GAME_FILES_DIR)) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    const stat = await fs.stat(filePath);
    const fileBuffer = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

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
