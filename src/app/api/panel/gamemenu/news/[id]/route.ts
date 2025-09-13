import { db } from "@/db";
import { game_menu_news } from "@/db/schema";
import { eq } from "drizzle-orm";
import { newsSchema } from "@/validations/panel/gameMenuSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await newsSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.game_menu_news.findFirst({
      where: eq(game_menu_news.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.game_menu_news.findFirst({
        where: eq(game_menu_news.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Label !== data.Label) {
      const labelConflict = await db.query.game_menu_news.findFirst({
        where: eq(game_menu_news.Label, data.iLabeld),
      });
      if (labelConflict) errors.Label = "Label already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(game_menu_news)
          .set(data)
          .where(eq(game_menu_news.id, Number(id)));
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
          .delete(game_menu_news)
          .where(eq(game_menu_news.id, Number(id)));
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
