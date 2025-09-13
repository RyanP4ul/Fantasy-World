import { db } from "@/db";
import { npcs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { npcSchema } from "@/validations/panel/npcValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await npcSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.npcs.findFirst({
      where: eq(npcs.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.npcs.findFirst({
        where: eq(npcs.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.Name != data.Name) {
      const nameConflict = await db.query.npcs.findFirst({
        where: eq(npcs.Name, data.Name),
      });
      if (nameConflict) errors.Name = "Name already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    if (data.TextNameColor && data.TextNameColor.startsWith("#")) {
      data.TextNameColor = String(data.TextNameColor).replace("#", "0x");
    }

    if (data.TextGuildColor && data.TextGuildColor.startsWith("#")) {
      data.TextGuildColor = String(data.TextGuildColor).replace("#", "0x");
    }

    await db
      .transaction(async (tx) => {
        await tx
          .update(npcs)
          .set(data)
          .where(eq(npcs.id, Number(id)));
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
        await tx.delete(npcs).where(eq(npcs.id, Number(id)));
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
