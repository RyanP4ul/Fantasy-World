import { db } from "@/db";
import { npcs, npcs_entity_generic } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { genericSchema } from "@/validations/panel/npcValidator";

export async function GET() {
  const res = await db.query.npcs_entity_generic.findMany({
    orderBy: desc(npcs_entity_generic.id),
  });

  const npcObj = await db.query.npcs.findMany({ orderBy: asc(npcs.id) });

  const modified = res.map((data) => {
    return {
      ...data,
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

  if ((await genericSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.npcs_entity_generic.findFirst({
    where: eq(npcs_entity_generic.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const npcConflict = await db.query.npcs_entity_generic.findFirst({
    where: eq(npcs_entity_generic.NpcID, data.NpcID),
  });
  if (npcConflict) errors.NpcID = "NpcID already exists";

  const npcExist = await db.query.npcs.findFirst({
    where: eq(npcs.id, data.NpcID),
  });
  if (!npcExist) errors.NpcID = "NpcID does not exist";

  if (npcExist?.EntityType === "Humanoid") {
    errors.NpcID = "NpcID is not a Generic NPC";
  }

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(npcs_entity_generic).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}