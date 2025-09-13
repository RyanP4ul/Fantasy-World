import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { itemSchema } from "@/validations/panel/itemValidator";
import { getEquipmentByType } from "@/lib/utils";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await itemSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldAura = await db.query.items.findFirst({
      where: eq(items.id, Number(data.oldId)),
    });

    if (!oldAura) return Response.json("Old Record not found", { status: 404 });

    if (oldAura.id !== data.id) {
      const idConflict = await db.query.items.findFirst({
        where: eq(items.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (oldAura.Name !== data.Name) {
      const nameConflict = await db.query.items.findFirst({
        where: eq(items.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    const factionExist = await db.query.items.findFirst({
      where: eq(items.FactionID, data.FactionID),
    });
    if (!factionExist) errors.FactionID = "Faction ID does not exist";

    const enhExist = await db.query.items.findFirst({
      where: eq(items.EnhID, data.EnhID),
    });
    if (!enhExist) errors.EnhID = "Enhancement ID does not exist";

    const reqClassExist = await db.query.items.findFirst({
      where: eq(items.ReqClassID, data.ReqClassID),
    });
    if (!reqClassExist) errors.ReqClassID = "Required Class ID does not exist";

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    const equipment = data.Type === "Enhancement" ? data.Equipment : getEquipmentByType(data.Type);

    if (!equipment || equipment === "Unknown")
      return Response.json("Unknown type", { status: 400 });

    data = { ...data, Equipment: equipment };

    await db
      .transaction(async (tx) => {
        await tx
          .update(items)
          .set(data)
          .where(eq(items.id, Number(id)));
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
        await tx.delete(items).where(eq(items.id, Number(id)));
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
