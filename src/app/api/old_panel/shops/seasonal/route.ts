import { db } from "@/db";
import { shops, shops_seasonal } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { seasonalSchema } from "@/validations/panel/shopValidator";

export async function GET() {
  const res = await db.query.shops_seasonal.findMany({
    orderBy: desc(shops_seasonal.id),
  });

  const shopsCache = await db.query.shops.findMany({
    orderBy: asc(shops.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
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

  if ((await seasonalSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.shops_seasonal.findFirst({
    where: eq(shops_seasonal.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const shopExist = await db.query.shops.findFirst({
    where: eq(shops.id, data.ShopID),
  });
  if (!shopExist) errors.ShopID = "Shop ID does not exist";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(shops_seasonal).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
