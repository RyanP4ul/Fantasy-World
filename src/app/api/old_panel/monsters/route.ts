import { db } from "@/db";
import { monsters } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { monsterSchema } from "@/validations/panel/monsterValidator";

export async function GET() {
  const res = await db.query.monsters.findMany({
    orderBy: desc(monsters.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await monsterSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.monsters.findFirst({
    where: eq(monsters.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.monsters.findFirst({
    where: eq(monsters.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(monsters).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
