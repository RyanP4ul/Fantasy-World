import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const [gameVersions] = await db.execute(sql`SELECT * FROM settings_login WHERE location = 'loader'`) as any[];
    
    const arrayString: Record<string, string> = {};
    for (const gameVersion of gameVersions) {
      arrayString[gameVersion.name] = gameVersion.value;
    }

    return Response.json(arrayString);
  } catch (error) {
    return Response.json("An error occurred!");
  }
}
