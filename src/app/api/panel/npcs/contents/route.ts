import { db } from "@/db";
import { maps, npcs, npcs_contents } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { contentSchema } from "@/validations/panel/npcValidator";

export async function GET() {
  const res = await db.query.npcs_contents.findMany({
    orderBy: desc(npcs_contents.id),
  });

  console.log(res)

  const mapObj = await db.query.maps.findMany({ orderBy: asc(maps.id) });
  const npcObj = await db.query.npcs.findMany({ orderBy: asc(npcs.id) });

  const modified = res.map((data) => {
    return {
      ...data,
      Map: `${
        mapObj.find((map) => map.id === data.MapID)?.Name || "None"
      }`,
      Npc: `${
        npcObj.find((npc) => npc.id === data.NpcID)?.Name || "None"
      }`
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await contentSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.npcs_contents.findFirst({
    where: eq(npcs_contents.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const mapExist = await db.query.maps.findFirst({
    where: eq(maps.id, data.MapID),
  });
  if (!mapExist) errors.MapID = "MapID does not exist";

  const npcExist = await db.query.npcs.findFirst({
    where: eq(npcs.id, data.NpcID),
  });
  if (!npcExist) errors.NpcID = "NpcID does not exist";

  const npcConflict = await db.query.npcs_contents.findFirst({
    where: and(
        eq(npcs_contents.MapID, data.MapID), 
        eq(npcs_contents.NpcID, data.NpcID)
    ),
  });
  if (npcConflict) errors.NpcID = "MapID with NpcID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(npcs_contents).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}