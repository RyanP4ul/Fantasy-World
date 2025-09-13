import { db } from "@/db";
import { maps, maps_monsters, monsters } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { mapMonsterSchema } from "@/validations/panel/mapValidator";

export async function GET() {
  const res = await db.query.maps_monsters.findMany({
    orderBy: desc(maps_monsters.id),
  });

  const mapsCache = await db.query.maps.findMany({ orderBy: asc(maps.id) });
  const monstersCache = await db.query.monsters.findMany({ orderBy: asc(monsters.id) });

  const modified = res.map((mapItem) => {
    return {
      ...mapItem,
      MapName: `${
        mapsCache.find((map) => map.id === mapItem.MapID)?.Name || "None"
      }`,
      MonsterName: `${
        monstersCache.find((monster) => monster.id === mapItem.MonsterID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await mapMonsterSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.maps_monsters.findFirst({
    where: eq(maps_monsters.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const conflict = await db.query.maps_monsters.findFirst({
    where: and(
      eq(maps_monsters.MapID, data.MapID),
      eq(maps_monsters.MonsterID, data.MonsterID),
      eq(maps_monsters.MonMapID, data.MonMapID)
    ),
  });

  if (conflict) errors.MonMapID = "MonMapID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(maps_monsters).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
