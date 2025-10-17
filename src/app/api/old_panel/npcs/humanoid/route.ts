import { db } from "@/db";
import { items, npcs, npcs_entity_humanoid } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { humanoidSchema } from "@/validations/panel/npcValidator";

export async function GET() {
  const res = await db.query.npcs_entity_humanoid.findMany({
    orderBy: desc(npcs_entity_humanoid.id),
  });

  const npcObj = await db.query.npcs.findMany({ orderBy: asc(npcs.id) });

  const modified = res.map((user) => {
    return {
      ...user,
      Npc: `${npcObj.find((npc) => npc.id === user.NpcID)?.Name || "None"}`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await humanoidSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.npcs_entity_humanoid.findFirst({
    where: eq(npcs_entity_humanoid.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const npcConflict = await db.query.npcs_entity_humanoid.findFirst({
    where: eq(npcs_entity_humanoid.NpcID, data.NpcID),
  });
  if (npcConflict) errors.NpcID = "NpcID already exists";

  const npcExist = await db.query.npcs.findFirst({
    where: eq(npcs.id, data.NpcID),
  });
  if (!npcExist) errors.NpcID = "NpcID does not exist";

  if (npcExist?.EntityType === "Generic") {
    errors.NpcID = "NpcID is not a Humanoid NPC";
  }

  const equipments = String(data.Equipments).split(",");

  for (const equipment of equipments) {
    if (!Number(equipment)) {
      errors.Equipments = "Equipments must be a number";
      break;
    }

    const itemExist = await db.query.items.findFirst({
      where: eq(items.id, Number(equipment)),
    });
    if (!itemExist) errors.Equipments = `ItemID ${equipment} does not exist`;
  }

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(npcs_entity_humanoid).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
