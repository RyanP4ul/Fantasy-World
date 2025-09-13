import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { assignSchema } from "@/validations/panel/skillValidator";

export async function GET() {
  const res = await db.query.skills.findMany({
    orderBy: desc(skills.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await assignSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.skills.findFirst({
    where: eq(skills.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.skills.findFirst({
    where: eq(skills.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(skills).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}