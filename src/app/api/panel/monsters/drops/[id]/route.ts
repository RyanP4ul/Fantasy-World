import { db } from "@/db";
import { items, maps, monsters, monsters_drops } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { dropSchema } from "@/validations/panel/monsterValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await dropSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.monsters_drops.findFirst({
      where: eq(monsters_drops.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.monsters_drops.findFirst({
        where: eq(monsters_drops.id, data.id),
      });
      if (!idConflict) errors.id = "Id does not exist";
    }

    if (old.MonsterID !== data.MonsterID) {
      const monConflict = await db.query.monsters.findFirst({
        where: eq(monsters.id, data.MonsterID),
      });
      if (!monConflict) errors.MonsterID = "Monster ID does not exist";
    }

    if (old.ItemID !== data.ItemID) {
      const itemConflict = await db.query.items.findFirst({
        where: eq(items.id, data.ItemID),
      });
      if (!itemConflict) errors.ItemID = "Item ID does not exist";
    }

    if (old.MonsterID !== data.MonsterID || old.ItemID !== data.ItemID) {
      const monConflict = await db.query.monsters_drops.findFirst({
        where: and(
          eq(monsters_drops.MonsterID, data.MonsterID),
          eq(monsters_drops.ItemID, data.ItemID)
        ),
      });
      if (monConflict) errors.MonsterID = "Monster ID with item ID already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });
    await db
      .transaction(async (tx) => {
        await tx
          .update(monsters_drops)
          .set(data)
          .where(eq(monsters_drops.id, Number(id)));
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
        await tx.delete(monsters_drops).where(eq(monsters_drops.id, Number(id)));
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
