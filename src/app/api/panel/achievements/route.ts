import { db } from "@/db";
import { achievements } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { achievementSchema } from "@/validations/panel/achievementSchema";

export async function GET(req : Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 5;
  const offset = (page - 1) * limit;

  const res = await db.query.achievements.findMany({
    orderBy: desc(achievements.id),
    limit: limit,
    offset: offset,
  });

  const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(achievements);

  return Response.json({
    data: res,
    total: count,
    totalPages: Math.ceil(count / limit),
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await achievementSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.achievements.findFirst({
    where: eq(achievements.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.achievements.findFirst({
    where: eq(achievements.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(achievements).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}