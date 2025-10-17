import { db } from "@/db";
import { items, wheels } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { wheelSchema } from "@/validations/panel/wheelSchema";

export async function GET() {
  const res = await db.query.wheels.findMany({
    orderBy: desc(wheels.id),
  });

  const itemsCache = await db.query.items.findMany({
    orderBy: asc(items.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      ItemName: `${
        itemsCache.find((item) => item.id === data.ItemID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await wheelSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.wheels.findFirst({
    where: eq(wheels.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "ItemID does not exist";

  const itemConflict = await db.query.wheels.findFirst({
    where: eq(wheels.ItemID, data.ItemID),
  });
  if (itemConflict) errors.ItemID = "ItemID already assigned to wheels";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(wheels).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
