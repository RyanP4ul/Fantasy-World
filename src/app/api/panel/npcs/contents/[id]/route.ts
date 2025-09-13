import { db } from "@/db";
import { maps, npcs, npcs_contents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { contentSchema } from "@/validations/panel/npcValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await contentSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.npcs_contents.findFirst({
      where: eq(npcs_contents.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.npcs_contents.findFirst({
        where: eq(npcs_contents.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const mapExist = await db.query.maps.findFirst({
      where: eq(maps.id, data.MapID),
    });
    if (!mapExist) errors.MapID = "MapID does not exist";

    const npcExist = await db.query.npcs.findFirst({
      where: eq(npcs.id, data.NpcID),
    });
    if (!npcExist) errors.NpcID = "NpcID does not exist";

    if (old.NpcID != data.NpcID || old.MapID != data.MapID) {
      const npcConflict = await db.query.npcs_contents.findFirst({
        where: and(
          eq(npcs_contents.MapID, data.MapID),
          eq(npcs_contents.NpcID, data.NpcID)
        ),
      });
      if (npcConflict) errors.NpcID = "MapID with NpcID already exists";
    }

    // if (old.Name != data.Name) {
    //     const nameConflict = await db.query.npcs.findFirst({
    //       where: eq(npcs.Name, data.Name),
    //     });
    //     if (nameConflict) errors.Name = "Name already exists";
    // }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(npcs_contents)
          .set(data)
          .where(eq(npcs_contents.id, Number(id)));
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
        await tx.delete(npcs_contents).where(eq(npcs_contents.id, Number(id)));
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
