import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const [icons] = await db.execute(sql`SELECT File FROM assets_icons`) as any[];
    
    return Response.json(icons);
  } catch (error) {
    return Response.json("An error occurred!");
  }
}