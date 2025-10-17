import { db } from "@/db";
import { items, classes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { classSchema } from "@/validations/panel/classValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await classSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.classes.findFirst({
      where: eq(classes.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.classes.findFirst({
        where: eq(classes.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const itemExist = await db.query.items.findFirst({
      where: eq(items.id, data.ItemID),
    });
    if (!itemExist) errors.ItemID = "Item ID does not exist";

    if (old.ItemID != data.ItemID) {
      const itemConflict = await db.query.classes.findFirst({
        where: eq(classes.ItemID, data.ItemID),
      });
      if (!itemConflict) errors.ItemID = "Item ID already assigned";
    }

    const isClass = await db.query.items.findFirst({
      where: eq(items.Equipment, "ar"),
    });
    if (isClass) errors.ItemID = "Item is not a class";

    // if (old.Name != data.Name) {
    //     const nameConflict = await db.query.quests.findFirst({
    //       where: eq(quests.Name, data.Name),
    //     });
    //     if (nameConflict) errors.Name = "Name already exists";
    // }

    // if (data.ReqClassID && old.ReqClassID != data.ReqClassID) {
    //     const reqClassItemExist = await db.query.items.findFirst({
    //       where: eq(items.id, data.ReqClassID),
    //     });
    //     if (!reqClassItemExist) errors.ReqClassID = "Class ID does not exist";
    // }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(classes)
          .set(data)
          .where(eq(classes.id, Number(id)));
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
        await tx.delete(classes).where(eq(classes.id, Number(id)));
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
