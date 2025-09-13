import { db } from "@/db";
import { items, shops, shops_items } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { itemSchema } from "@/validations/panel/shopValidator";

export async function GET() {
  const res = await db.query.shops_items.findMany({
    orderBy: desc(shops_items.id),
  });

  const shopsCache = await db.query.shops.findMany({
    orderBy: asc(shops.id),
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
      ShopName: `${
        shopsCache.find((shop) => shop.id === data.ShopID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await itemSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.shops_items.findFirst({
    where: eq(shops_items.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const shopExist = await db.query.shops.findFirst({
    where: eq(shops.id, data.ShopID),
  });
  if (!shopExist) errors.ShopID = "Shop ID does not exist";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "Item ID does not exist";

  const itemConflict = await db.query.shops_items.findFirst({
    where: and(
      eq(shops_items.ShopID, data.ShopID),
      eq(shops_items.ItemID, data.ItemID)
    ),
  });
  if (itemConflict) errors.ItemID = "Item ID with stat already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(shops_items).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
