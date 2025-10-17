import { db } from "@/db";
import { npcs, npcs_entity_generic } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { genericSchema } from "@/validations/panel/npcValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await genericSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.npcs_entity_generic.findFirst({
      where: eq(npcs_entity_generic.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.npcs_entity_generic.findFirst({
        where: eq(npcs_entity_generic.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.NpcID !== data.NpcID) {
      const npcConflict = await db.query.npcs_entity_generic.findFirst({
        where: eq(npcs_entity_generic.NpcID, data.NpcID),
      });
      if (npcConflict) errors.NpcID = "NpcID already exists";
    }

    const npcExist = await db.query.npcs.findFirst({
      where: eq(npcs.id, data.NpcID),
    });
    if (!npcExist) errors.NpcID = "NpcID does not exist";

    if (npcExist?.EntityType === "Humanoid") {
      errors.NpcID = "NpcID is not a Generic NPC";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(npcs_entity_generic)
          .set(data)
          .where(eq(npcs_entity_generic.id, Number(id)));
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
          .delete(npcs_entity_generic)
          .where(eq(npcs_entity_generic.id, Number(id)));
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
