import { db } from "@/db";
import { monsters, monsters_skills, skills } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { skillSchema } from "@/validations/panel/monsterValidator";

export async function GET() {
  const res = await db.query.monsters_skills.findMany({
    orderBy: desc(monsters_skills.id),
  });

  const monstersCache = await db.query.monsters.findMany({ orderBy: asc(monsters.id) });
  const skillsCache = await db.query.skills.findMany({
    orderBy: asc(skills.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      SkillName: `${
        skillsCache.find((skill) => skill.id === data.SkillID)?.Name ||
        "None"
      }`,
      MonsterName: `${
        monstersCache.find((monster) => monster.id === data.MonsterID)?.Name ||
        "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await skillSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.monsters_skills.findFirst({
    where: eq(monsters_skills.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const monExist = await db.query.monsters.findFirst({
    where: eq(monsters.id, data.MonsterID),
  });
  if (!monExist) errors.MonsterID = "Monster ID does not exist";

  const skillExist = await db.query.skills.findFirst({
    where: eq(skills.id, data.SkillID),
  });
  if (!skillExist) errors.SkillID = "Skill ID does not exist";

  const skillConflict = await db.query.monsters_skills.findFirst({
    where: and(
      eq(monsters_skills.MonsterID, data.MonsterID),
      eq(monsters_skills.SkillID, data.SkillID)
    ),
  });
  if (skillConflict) errors.SkillID = "Monster ID with skill ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(monsters_skills).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
