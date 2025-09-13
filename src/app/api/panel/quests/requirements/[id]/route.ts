import { db } from "@/db";
import { items, quests, quests_requirements } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { reqSchema } from "@/validations/panel/questValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await reqSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.quests_requirements.findFirst({
      where: eq(quests_requirements.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.quests_requirements.findFirst({
        where: eq(quests_requirements.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    // if (old.Name != data.Name) {
    //     const nameConflict = await db.query.quests.findFirst({
    //       where: eq(quests.Name, data.Name),
    //     });
    //     if (nameConflict) errors.Name = "Name already exists";
    // }

    if (old.QuestID != data.QuestID || old.ItemID != data.ItemID) {
      const questConflict = await db.query.quests_requirements.findFirst({
        where: and(
          eq(quests_requirements.QuestID, data.QuestID),
          eq(quests_requirements.ItemID, data.ItemID)
        ),
      });

      if (questConflict)
        errors.QuestID = "Quest ID with item ID already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(quests_requirements)
          .set(data)
          .where(eq(quests_requirements.id, Number(id)));
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
        await tx.delete(quests_requirements).where(eq(quests_requirements.id, Number(id)));
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
