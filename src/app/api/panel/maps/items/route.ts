import { db } from "@/db";
import { items, maps, maps_items } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { mapItemSchema } from "@/validations/panel/mapValidator";

export async function GET() {
  const res = await db.query.maps_items.findMany({
    orderBy: desc(maps_items.id),
  });

  const mapsCache = await db.query.maps.findMany({ orderBy: asc(maps.id) });
  const itemsCache = await db.query.items.findMany({ orderBy: asc(items.id) });

  const modified = res.map((mapItem) => {
    return {
      ...mapItem,
      MapName: `${
        mapsCache.find((map) => map.id === mapItem.MapID)?.Name || "None"
      }`,
      ItemName: `${
        itemsCache.find((item) => item.id === mapItem.ItemID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await mapItemSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.maps_items.findFirst({
    where: eq(maps_items.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const conflict = await db.query.maps_items.findFirst({
    where: and(
      eq(maps_items.MapID, data.MapID),
      eq(maps_items.ItemID, data.ItemID)
    ),
  });
  if (conflict) errors.MapID = "MapID with ItemID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(maps_items).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
