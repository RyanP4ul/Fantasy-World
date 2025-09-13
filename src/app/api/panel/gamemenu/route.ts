import { db } from "@/db";
import { game_menu } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { gameMenuSchema } from "@/validations/panel/gameMenuSchema";

export async function GET() {
  const res = await db.query.game_menu.findMany({
    orderBy: desc(game_menu.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await gameMenuSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.game_menu.findFirst({
    where: eq(game_menu.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(game_menu).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}