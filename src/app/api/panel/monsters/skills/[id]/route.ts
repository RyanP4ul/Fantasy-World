import { db } from "@/db";
import { skills, monsters, monsters_skills } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { skillSchema } from "@/validations/panel/monsterValidator";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  const id = (await context.params)?.id || -1;

  try {
    const data = await req.json();
    const errors: Record<string, string> = {};

    if ((await skillSchema.safeParseAsync(data)).success === false)
      return Response.json("Invalid data", { status: 400 });

    const old = await db.query.monsters_skills.findFirst({
      where: eq(monsters_skills.id, Number(data.oldId)),
    });

    if (!old) return Response.json("Old Record not found", { status: 404 });

    if (old.id !== data.id) {
      const idConflict = await db.query.monsters_skills.findFirst({
        where: eq(monsters_skills.id, data.id),
      });
      if (!idConflict) errors.id = "Id does not exist";
    }

    if (old.MonsterID !== data.MonsterID) {
      const monConflict = await db.query.monsters.findFirst({
        where: eq(monsters.id, data.MonsterID),
      });
      if (!monConflict) errors.MonsterID = "Monster ID does not exist";
    }

    if (old.SkillID !== data.SkillID) {
      const skillConflict = await db.query.skills.findFirst({
        where: eq(skills.id, data.SkillID),
      });
      if (!skillConflict) errors.SkillID = "Skill ID does not exist";
    }

    if (old.MonsterID !== data.MonsterID || old.SkillID !== data.SkillID)
    {
        const monConflict = await db.query.monsters_skills.findFirst({
          where: and(
            eq(monsters_skills.MonsterID, data.MonsterID),
            eq(monsters_skills.SkillID, data.SkillID)
          ),
        });
        if (monConflict) errors.MonsterID = "Monster ID with map ID already exists";
    }

    if (Object.keys(errors).length > 0)
      return Response.json({ errors }, { status: 400 });

    await db
      .transaction(async (tx) => {
        await tx
          .update(monsters_skills)
          .set(data)
          .where(eq(monsters_skills.id, Number(id)));
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
        await tx.delete(monsters_skills).where(eq(monsters_skills.id, Number(id)));
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
