import { db } from "@/db";
import { items, monsters, monsters_drops } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { dropSchema } from "@/validations/panel/monsterValidator";

export async function GET() {
  const res = await db.query.monsters_drops.findMany({
    orderBy: desc(monsters_drops.id),
  });

  const monstersCache = await db.query.monsters.findMany({ orderBy: asc(monsters.id) });
  const itemsCache = await db.query.items.findMany({ orderBy: asc(items.id) });

  const modified = res.map((mapItem) => {
    return {
      ...mapItem,
      MonsterName: `${
        monstersCache.find((monster) => monster.id === mapItem.MonsterID)?.Name || "None"
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

  if ((await dropSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.monsters_drops.findFirst({
    where: eq(monsters_drops.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const monExist = await db.query.monsters.findFirst({
    where: eq(monsters.id, data.MonsterID),
  });
  if (!monExist) errors.MonsterID = "Monster ID does not exist";

  const itemExist = await db.query.items.findFirst({
    where: eq(items.id, data.ItemID),
  });
  if (!itemExist) errors.ItemID = "Item ID does not exist";

  const itemConflict = await db.query.monsters_drops.findFirst({
    where: and(
      eq(monsters_drops.MonsterID, data.MonsterID),
      eq(monsters_drops.ItemID, data.ItemID)
    ),
  });
  if (itemConflict) errors.MonsterID = "Monster ID with item ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(monsters_drops).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
