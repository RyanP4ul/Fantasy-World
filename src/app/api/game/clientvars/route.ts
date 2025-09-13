import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const [clientVars] = await db.execute(sql`SELECT * FROM settings_login WHERE location = 'game'`) as any[];
    
    const arrayString: Record<string, string> = {};
    for (const clientVar of clientVars) {
      arrayString[clientVar.name] = clientVar.value;
    }

    return Response.json(arrayString);
  } catch (error) {
    return Response.json("An error occurred!");
  }
}
