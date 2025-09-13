import { db } from "@/db";
import { maps_npcs, npcs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { mapNpcSchema } from "@/validations/panel/mapValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await mapNpcSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.maps_npcs.findFirst({
      where: eq(maps_npcs.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const old = await db.query.maps_npcs.findFirst({
        where: eq(maps_npcs.id, data.id),
      });
      if (old) errors.id = "Id already exists";
    }

    if (old.NpcID != data.NpcID) {
      const npcExist = await db.query.npcs.findFirst({
        where: eq(npcs.id, data.NpcID),
      });
      if (!npcExist) errors.NpcID = "NpcID does not exist";
    }

    if (
      old.MapID !== data.MapID &&
      old.NpcID !== data.NpcID &&
      old.NpcMapID !== data.NpcMapID
    ) {
      const mapMonsterConflict = await db.query.maps_npcs.findFirst({
        where: and(
          eq(maps_npcs.MapID, data.MapID),
          eq(maps_npcs.NpcID, data.NpcID),
          eq(maps_npcs.NpcMapID, data.NpcMapID)
        ),
      });
      if (mapMonsterConflict) errors.NpcMapID = "NpcMapID already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(maps_npcs)
          .set(data)
          .where(eq(maps_npcs.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error updating " + error, { status: 403 });
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
        await tx.delete(maps_npcs).where(eq(maps_npcs.id, Number(id)));
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
