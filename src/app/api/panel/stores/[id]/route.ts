import { db } from "@/db";
import { achievements, stores, titles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { storeSchema } from "@/validations/panel/storeSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await storeSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.stores.findFirst({
      where: eq(stores.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.stores.findFirst({
        where: eq(stores.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Name != data.Name) {
      const nameConflict = await db.query.stores.findFirst({
        where: eq(stores.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (data.TitleID && old.TitleID != data.TitleID) {
      const titleExist = await db.query.titles.findFirst({
        where: eq(titles.id, data.TitleID),
      });
      if (!titleExist) {
        errors.TitleID = "Title ID does not exist";
      }
    }

    if (data.AchievementID && data.AchievementID) {
      const achievementExist = await db.query.achievements.findFirst({
        where: eq(achievements.id, data.AchievementID),
      });
      if (!achievementExist) {
        errors.AchievementID = "Achievement ID does not exist";
      }
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(stores)
          .set(data)
          .where(eq(stores.id, Number(id)));
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
        await tx.delete(stores).where(eq(stores.id, Number(id)));
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
