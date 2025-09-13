import { db } from "@/db";
import { shops } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { shopSchema } from "@/validations/panel/shopValidator";

export async function GET() {
  const res = await db.query.shops.findMany({
    orderBy: desc(shops.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await shopSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.shops.findFirst({
    where: eq(shops.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.shops.findFirst({
    where: eq(shops.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(shops).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}