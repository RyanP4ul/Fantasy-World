import { db } from "@/db";
import { maps_monsters } from "@/db/schema";
import { and, eq } from 'drizzle-orm';
import { mapMonsterSchema } from "@/validations/panel/mapValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await mapMonsterSchema.safeParseAsync(data)).success === false) return Response.json("Invalid data", { status: 400 });

    const old = await db.query.maps_monsters.findFirst({
      where: eq(maps_monsters.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const old = await db.query.maps_monsters.findFirst({where: eq(maps_monsters.id, data.id)});
      if (old) errors.id = "Id already exists";
    }

    if (old.MapID !== data.MapID && old.MonsterID !== data.MonsterID && old.MonMapID !== data.MonMapID) {
        const mapMonsterConflict = await db.query.maps_monsters.findFirst({
            where: and(
                eq(maps_monsters.MapID, data.MapID),
                eq(maps_monsters.MonsterID, data.MonsterID),
                eq(maps_monsters.MonMapID, data.MonMapID)
            ),
        });
        if (mapMonsterConflict) errors.MonMapID = "MonMapID already exists";
    }


    if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

    await db.transaction(async (tx) => {
      await tx.update(maps_monsters).set(data).where(eq(maps_monsters.id, Number(id)));
    }).catch(() => {
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
    await db.transaction(async (tx) => {
      await tx.delete(maps_monsters).where(eq(maps_monsters.id, Number(id)));
    }).catch(() => {
      return Response.json("Error transaction", { status: 500 });
    });

    return Response.json("Deleted successfully", { status: 200 });

  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error deleting", { status: 403 });
    }
  }
}