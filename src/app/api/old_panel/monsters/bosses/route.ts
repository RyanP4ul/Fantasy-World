import { db } from "@/db";
import { maps, monsters, monsters_bosses } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { bossSchema } from "@/validations/panel/monsterValidator";

export async function GET() {
  const res = await db.query.monsters_bosses.findMany({
    orderBy: desc(monsters_bosses.id),
  });

  const mapsCache = await db.query.maps.findMany({ orderBy: asc(maps.id) });
  const monstersCache = await db.query.monsters.findMany({
    orderBy: asc(monsters.id),
  });

  const modified = res.map((mapItem) => {
    return {
      ...mapItem,
      MapName: `${
        mapsCache.find((map) => map.id === mapItem.MapID)?.Name || "None"
      }`,
      MonsterName: `${
        monstersCache.find((monster) => monster.id === mapItem.MonsterID)
          ?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await bossSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.monsters_bosses.findFirst({
    where: eq(monsters_bosses.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const monExist = await db.query.monsters.findFirst({
    where: eq(monsters.id, data.MonsterID),
  });
  if (!monExist) errors.MonsterID = "Monster ID does not exist";

  const mapExist = await db.query.maps.findFirst({
    where: eq(maps.id, data.MapID),
  });
  if (!mapExist) errors.MapID = "Map ID does not exist";

  const monConflict = await db.query.monsters_bosses.findFirst({
    where: and(
      eq(monsters_bosses.MonsterID, data.MonsterID),
      eq(monsters_bosses.MapID, data.MapID)
    ),
  });
  if (monConflict) errors.MonsterID = "Monster ID with map ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(monsters_bosses).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
