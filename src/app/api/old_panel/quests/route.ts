import { db } from "@/db";
import { items, quests } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { questSchema } from "@/validations/panel/questValidator";

export async function GET() {
  const res = await db.query.quests.findMany({
    orderBy: desc(quests.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await questSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.quests.findFirst({
    where: eq(quests.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.quests.findFirst({
    where: eq(quests.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (data.ReqClassID) {
    const reqClassItemExist = await db.query.items.findFirst({
      where: eq(items.id, data.ReqClassID),
    });
    if (!reqClassItemExist) errors.ReqClassID = "Class ID does not exist";
  }

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(quests).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}