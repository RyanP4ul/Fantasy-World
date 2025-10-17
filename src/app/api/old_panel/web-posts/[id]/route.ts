import { db } from "@/db";
import { web_posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { webPostSchema } from "@/validations/panel/webSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await webPostSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.web_posts.findFirst({
      where: eq(web_posts.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.web_posts.findFirst({
        where: eq(web_posts.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Title != data.Title) {
        const titleConflict = await db.query.web_posts.findFirst({
          where: eq(web_posts.Title, data.Title),
        });
        if (titleConflict) errors.Title = "Title already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(web_posts)
          .set(data)
          .where(eq(web_posts.id, Number(id)));
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
          .delete(web_posts)
          .where(eq(web_posts.id, Number(id)));
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
