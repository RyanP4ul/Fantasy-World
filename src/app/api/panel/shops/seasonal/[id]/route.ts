import { db } from "@/db";
import { shops, shops_seasonal } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { seasonalSchema } from "@/validations/panel/shopValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await seasonalSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.shops_seasonal.findFirst({
      where: eq(shops_seasonal.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.shops_seasonal.findFirst({
        where: eq(shops_seasonal.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.ShopID !== data.ShopID) {
      const shopExist = await db.query.shops.findFirst({
        where: eq(shops.id, data.ShopID),
      });
      if (!shopExist) errors.ShopID = "Shop ID does not exist";
    }


    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(shops_seasonal)
          .set(data)
          .where(eq(shops_seasonal.id, Number(id)));
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
        await tx.delete(shops_seasonal).where(eq(shops_seasonal.id, Number(id)));
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
