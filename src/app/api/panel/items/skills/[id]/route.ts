import { db } from "@/db";
import { items, items_skills, skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { skillSchema } from "@/validations/panel/itemValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    let data = await req.json();
    const errors: Record<string, string> = {};

    if ((await skillSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldAura = await db.query.items_skills.findFirst({
      where: eq(items_skills.id, Number(data.oldId)),
    });

    if (!oldAura) return Response.json("Old Record not found", { status: 404 });

    if (oldAura.id !== data.id) {
      const idConflict = await db.query.items_skills.findFirst({
        where: eq(items_skills.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const itemExist = await db.query.items.findFirst({
      where: eq(items.id, data.ItemID),
    });
    if (!itemExist) errors.ItemID = "Item ID does not exist";

    const skillExist = await db.query.skills.findFirst({
      where: eq(skills.id, data.SkillID),
    });
    if (!skillExist) errors.SkillID = "Skill ID does not exist";

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(items_skills)
          .set(data)
          .where(eq(items_skills.id, Number(id)));
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
        await tx.delete(items_skills).where(eq(items_skills.id, Number(id)));
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
