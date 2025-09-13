import { db } from "@/db";
import { items, quests, quests_rewards } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { rewardSchema } from "@/validations/panel/questValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await rewardSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.quests_rewards.findFirst({
      where: eq(quests_rewards.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.quests_rewards.findFirst({
        where: eq(quests_rewards.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    if (old.QuestID != data.QuestID) {
      const questConflict = await db.query.quests.findFirst({
        where: eq(quests.id, data.QuestID),
      });
      if (!questConflict) errors.QuestID = "Quest ID already exists";
    }

    if (old.ItemID != data.ItemID) {
      const itemConflict = await db.query.items.findFirst({
        where: eq(items.id, data.ItemID),
      });
      if (!itemConflict) errors.ItemID = "Item ID already exists";
    }

    if (old.QuestID != data.QuestID || old.ItemID != data.ItemID) {
      const rewardConflict = await db.query.quests_rewards.findFirst({
        where: and(
          eq(quests_rewards.QuestID, data.QuestID),
          eq(quests_rewards.ItemID, data.ItemID)
        ),
      });
      if (rewardConflict) errors.ItemID = "Item ID with stat already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(quests)
          .set(data)
          .where(eq(quests.id, Number(id)));
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
        await tx.delete(quests_rewards).where(eq(quests_rewards.id, Number(id)));
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
