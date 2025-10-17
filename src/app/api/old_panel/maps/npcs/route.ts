import { db } from "@/db";
import { maps, maps_npcs, npcs } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { mapNpcSchema } from "@/validations/panel/mapValidator";

export async function GET() {
  const res = await db.query.maps_npcs.findMany({
    orderBy: desc(maps_npcs.id),
  });

  const mapsCache = await db.query.maps.findMany({ orderBy: asc(maps.id) });
  const npcsCache = await db.query.npcs.findMany({ orderBy: asc(npcs.id) });

  const modified = res.map((mapItem) => {
    return {
      ...mapItem,
      MapName: `${
        mapsCache.find((map) => map.id === mapItem.MapID)?.Name || "None"
      }`,
      NpcName: `${
        npcsCache.find((npc) => npc.id === mapItem.NpcID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await mapNpcSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.maps_npcs.findFirst({
    where: eq(maps_npcs.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const npcExist = await db.query.npcs.findFirst({
    where: eq(npcs.id, data.NpcID),
  });
  if (!npcExist) errors.NpcID = "NpcID does not exist";

  const conflict = await db.query.maps_npcs.findFirst({
    where: and(
      eq(maps_npcs.MapID, data.MapID),
      eq(maps_npcs.NpcID, data.NpcID),
      eq(maps_npcs.NpcMapID, data.NpcMapID)
    ),
  });

  if (conflict) errors.NpcMapID = "NpcMapID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(maps_npcs).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
