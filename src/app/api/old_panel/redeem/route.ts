import { db } from "@/db";
import { items, redeems } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { redeemSchema } from "@/validations/panel/redeemSchema";

export async function GET() {
  const res = await db.query.redeems.findMany({
    orderBy: desc(redeems.id),
  });

  const itemsCache = await db.query.items.findMany({
      orderBy: asc(items.id),
    });

  const modified = res.map((data) => {
    return {
      ...data,
      ItemName: `${
        itemsCache.find((item) => item.id === data.ItemID)?.Name ||
        "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  const safeParse = await redeemSchema.safeParseAsync(data);
  if (safeParse.success === false)
    return Response.json(JSON.stringify(safeParse.error), { status: 400 });

  const idConflict = await db.query.redeems.findFirst({
    where: eq(redeems.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const codeConflict = await db.query.redeems.findFirst({
    where: eq(redeems.Code, data.Code),
  });
  if (codeConflict) errors.Code = "Code already exists";

  const ItemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!ItemExist) errors.ItemID = "ItemID ID does not exist";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(redeems).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
