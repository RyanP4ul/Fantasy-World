import { db } from "@/db";
import { skills_auras } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auraSchema } from "@/validations/panel/skillValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await auraSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.skills_auras.findFirst({
      where: eq(skills_auras.id, Number(data.oldId)),
    });

    if (!old)
      return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.skills_auras.findFirst({
        where: eq(skills_auras.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const auraIdConflict = await db.query.skills_auras.findFirst({
      where: and(
        eq(skills_auras.SkillID, data.SkillID),
        eq(skills_auras.AuraID, data.AuraID)
      ),
    });

    if (auraIdConflict) errors.AuraID = "Aura ID with skill ID already exists";

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(skills_auras)
          .set(data)
          .where(eq(skills_auras.id, Number(id)));
      })
      .catch(() => {
        return Response.json("Error transaction", { status: 500 });
      });

    return Response.json("Updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json("Error updating " + error.message, { status: 403 });
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
        await tx.delete(skills_auras).where(eq(skills_auras.id, Number(id)));
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
