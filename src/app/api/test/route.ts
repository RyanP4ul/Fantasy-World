import { NextResponse } from "next/server";
import { db } from "@/db";
import { achievements } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1"); // 0-based
  const limit = parseInt(searchParams.get("limit") || "10");

  const offset = (page - 1) * limit;

  const data = await db
    .select()
    .from(achievements)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(achievements);

  return NextResponse.json({
    data,
    total: count,
    totalPages: Math.ceil(count / limit),
  });
}
