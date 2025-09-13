import { db } from "@/db";
import { monsters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { monsterSchema } from "@/validations/panel/monsterValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await monsterSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldAura = await db.query.monsters.findFirst({
      where: eq(monsters.id, Number(data.oldId)),
    });

    if (!oldAura) return Response.json("Old Record not found", { status: 404 });

    if (oldAura.id !== data.id) {
      const idConflict = await db.query.monsters.findFirst({
        where: eq(monsters.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (oldAura.Name !== data.Name) {
      const nameConflict = await db.query.monsters.findFirst({
        where: eq(monsters.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(monsters)
          .set(data)
          .where(eq(monsters.id, Number(id)));
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
        await tx.delete(monsters).where(eq(monsters.id, Number(id)));
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
