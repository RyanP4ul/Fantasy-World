import { db } from "@/db";
import { auras } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auraSchema } from "@/validations/panel/auraValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await auraSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldAura = await db.query.auras.findFirst({
      where: eq(auras.id, Number(data.oldId)),
    });

    if (!oldAura) return Response.json("Old Record not found", { status: 404 });

    if (oldAura.id !== data.id) {
      const idConflict = await db.query.auras.findFirst({
        where: eq(auras.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (oldAura.Name !== data.Name) {
      const nameConflict = await db.query.auras.findFirst({
        where: eq(auras.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    const updateData = { ...data, Chance: Number(data.Chance) };

    await db
      .transaction(async (tx) => {
        await tx
          .update(auras)
          .set(updateData)
          .where(eq(auras.id, Number(id)));
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
        await tx.delete(auras).where(eq(auras.id, Number(id)));
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
