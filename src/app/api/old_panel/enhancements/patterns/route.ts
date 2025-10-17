import { db } from "@/db";
import { enhancements_patterns } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { patternSchema } from "@/validations/panel/enhancementSchema";

export async function GET() {
  const res = await db.query.enhancements_patterns.findMany({
    orderBy: desc(enhancements_patterns.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await patternSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.enhancements_patterns.findFirst({
    where: eq(enhancements_patterns.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.enhancements_patterns.findFirst({
    where: eq(enhancements_patterns.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(enhancements_patterns).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}