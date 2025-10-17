import { db } from "@/db";
import { maps, monsters, monsters_bosses } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { bossSchema } from "@/validations/panel/monsterValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await bossSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.monsters_bosses.findFirst({
      where: eq(monsters_bosses.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.monsters_bosses.findFirst({
        where: eq(monsters_bosses.id, data.id),
      });
      if (!idConflict) errors.id = "Id does not exist";
    }

    if (old.MonsterID !== data.MonsterID) {
      const monConflict = await db.query.monsters.findFirst({
        where: eq(monsters.id, data.MonsterID),
      });
      if (!monConflict) errors.MonsterID = "Monster ID does not exist";
    }

    if (old.MapID !== data.MapID) {
      const mapConflict = await db.query.maps.findFirst({
        where: eq(maps.id, data.MapID),
      });
      if (!mapConflict) errors.MapID = "Map ID does not exist";
    }

    if (old.MonsterID !== data.MonsterID || old.MapID !== data.MapID)
    {
        const monConflict = await db.query.monsters_bosses.findFirst({
          where: and(
            eq(monsters_bosses.MonsterID, data.MonsterID),
            eq(monsters_bosses.MapID, data.MapID)
          ),
        });
        if (monConflict) errors.MonsterID = "Monster ID with map ID already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(monsters_bosses)
          .set(data)
          .where(eq(monsters_bosses.id, Number(id)));
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
        await tx.delete(monsters_bosses).where(eq(monsters_bosses.id, Number(id)));
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
