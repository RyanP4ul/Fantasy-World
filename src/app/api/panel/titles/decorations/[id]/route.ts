import { db } from "@/db";
import { titles_styles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decorationSchema } from "@/validations/panel/titleValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await decorationSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.titles_styles.findFirst({
      where: eq(titles_styles.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.titles_styles.findFirst({
        where: eq(titles_styles.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Name != data.Name) {
        const nameConflict = await db.query.titles_styles.findFirst({
          where: eq(titles_styles.Name, data.Name),
        });
        if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(titles_styles)
          .set(data)
          .where(eq(titles_styles.id, Number(id)));
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
        await tx
          .delete(titles_styles)
          .where(eq(titles_styles.id, Number(id)));
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
