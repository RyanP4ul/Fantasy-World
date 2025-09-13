import { db } from "@/db";
import { auras_effects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auraEffectSchema } from "@/validations/panel/auraEffectValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await auraEffectSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const oldAuraEffect = await db.query.auras_effects.findFirst({
      where: eq(auras_effects.id, Number(data.oldId)),
    });

    if (!oldAuraEffect)
      return Response.json("Old Record not found", { status: 404 });

    if (oldAuraEffect.id !== data.id) {
      const idConflict = await db.query.auras_effects.findFirst({
        where: eq(auras_effects.id, data.id),
      });
      if (idConflict) errors.id = "Id already exists";
    }

    const auraIdConflict = await db.query.auras_effects.findFirst({
      where: and(
        eq(auras_effects.AuraID, data.AuraID),
        eq(auras_effects.Stat, data.Stat)
      ),
    });

    if (auraIdConflict) errors.AuraID = "Aura ID with stat already exists";

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    const updateData = { ...data, Value: String(data.Value) };

    await db
      .transaction(async (tx) => {
        await tx
          .update(auras_effects)
          .set(updateData)
          .where(eq(auras_effects.id, Number(id)));
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
        await tx.delete(auras_effects).where(eq(auras_effects.id, Number(id)));
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
