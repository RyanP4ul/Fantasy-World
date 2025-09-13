import { db } from "@/db";
import { achievements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { achievementSchema } from "@/validations/panel/achievementSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await achievementSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.achievements.findFirst({
      where: eq(achievements.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.achievements.findFirst({
        where: eq(achievements.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Name != data.Name) {
      const nameConflict = await db.query.achievements.findFirst({
        where: eq(achievements.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(achievements)
          .set(data)
          .where(eq(achievements.id, Number(id)));
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
        const result = await tx
          .delete(achievements)
          .where(eq(achievements.id, Number(id)));

        if (result) {
          return Response.json("No record found to delete", { status: 500 });
        }
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Deleted successfully " + id, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error deleting", { status: 403 });
    }
  }
}
