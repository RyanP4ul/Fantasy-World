import { db } from "@/db";
import { maps_items } from "@/db/schema";
import { and, eq } from 'drizzle-orm';
import { mapItemSchema } from "@/validations/panel/mapValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await mapItemSchema.safeParseAsync(data)).success === false) return Response.json("Invalid data", { status: 400 });

    const old = await db.query.maps_items.findFirst({
      where: eq(maps_items.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const old = await db.query.maps_items.findFirst({where: eq(maps_items.id, data.id)});
      if (old) errors.id = "Id already exists";
    }

    if (old.MapID !== data.MapID && old.ItemID !== data.ItemID) {
        const mapItemConflict = await db.query.maps_items.findFirst({
            where: and(
                eq(maps_items.MapID, data.MapID),
                eq(maps_items.ItemID, data.ItemID)
            ),
        });
        if (mapItemConflict) errors.MapID = "MapID with ItemID already exists";
    }

    if (Object.keys(errors).length > 0) return Response.json({ errors }, { status: 400 });

    await db.transaction(async (tx) => {
      await tx.update(maps_items).set(data).where(eq(maps_items.id, Number(id)));
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
      await tx.delete(maps_items).where(eq(maps_items.id, Number(id)));
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