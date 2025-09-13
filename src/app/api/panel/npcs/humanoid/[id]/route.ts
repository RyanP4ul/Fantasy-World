import { db } from "@/db";
import { items, npcs, npcs_entity_humanoid } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { humanoidSchema } from "@/validations/panel/npcValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await humanoidSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.npcs_entity_humanoid.findFirst({
      where: eq(npcs_entity_humanoid.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.npcs_entity_humanoid.findFirst({
        where: eq(npcs_entity_humanoid.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.NpcID != data.NpcID) {
      const npcConflict = await db.query.npcs_entity_humanoid.findFirst({
        where: eq(npcs_entity_humanoid.NpcID, data.NpcID),
      });
      if (npcConflict) errors.NpcID = "NpcID already exists";
    }

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

    await db
      .transaction(async (tx) => {
        await tx
          .update(npcs_entity_humanoid)
          .set(data)
          .where(eq(npcs_entity_humanoid.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error updating", { status: 403 });
    }
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    await db
      .transaction(async (tx) => {
        await tx
          .delete(npcs_entity_humanoid)
          .where(eq(npcs_entity_humanoid.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Deleted successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error deleting", { status: 403 });
    }
  }
}
