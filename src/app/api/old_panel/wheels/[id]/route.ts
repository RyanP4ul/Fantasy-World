import { db } from "@/db";
import { items, wheels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { wheelSchema } from "@/validations/panel/wheelSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await wheelSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.wheels.findFirst({
      where: eq(wheels.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.wheels.findFirst({
        where: eq(wheels.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.ItemID != data.ItemID) {
      const itemExist = await db.query.items.findFirst({
        where: eq(items.id, data.ItemID),
      });
      if (!itemExist) errors.ItemID = "ItemID does not exist";

      const itemConflict = await db.query.wheels.findFirst({
        where: eq(wheels.ItemID, data.ItemID),
      });
      if (itemConflict) errors.ItemID = "ItemID already assigned";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(wheels)
          .set(data)
          .where(eq(wheels.id, Number(id)));
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
        await tx.delete(wheels).where(eq(wheels.id, Number(id)));
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
