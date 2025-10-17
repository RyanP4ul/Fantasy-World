import { db } from "@/db";
import { book } from "@/db/schema";
import { eq } from "drizzle-orm";
import { bookSchema } from "@/validations/panel/bookSchema";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await bookSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldBook = await db.query.book.findFirst({
      where: eq(book.id, Number(data.oldId)),
    });

    if (!oldBook) return Response.json("Old Record not found", { status: 404 });

    if (oldBook.id !== data.id) {
      const idConflict = await db.query.book.findFirst({
        where: eq(book.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (oldBook.Name !== data.Name) {
      const nameConflict = await db.query.book.findFirst({
        where: eq(book.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    const updateData = { ...data, Chance: Number(data.Chance) };

    await db
      .transaction(async (tx) => {
        await tx
          .update(book)
          .set(updateData)
          .where(eq(book.id, Number(id)));
      })
      .catch(() => {
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
    await db
      .transaction(async (tx) => {
        await tx.delete(book).where(eq(book.id, Number(id)));
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
