import { db } from "@/db";
import { skills, items, skills_auras } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { assignSchema } from "@/validations/panel/skillValidator";

export async function GET() {
  const res = await db.query.skills_assign.findMany({
    orderBy: desc(skills_auras.id),
  });

  const skillsCache = await db.query.skills.findMany({
    orderBy: asc(skills.id),
  });
  const itemsCache = await db.query.items.findMany({
    orderBy: asc(items.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      ItemName: `${
        itemsCache.find((item) => item.id === data.ItemID)?.Name || "None"
      }`,
      SkillName: `${
        skillsCache.find((skill) => skill.id === data.SkillID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await assignSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.skills_assign.findFirst({
    where: eq(skills_auras.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const itemIdConflict = await db.query.skills_assign.findFirst({
    where: and(
      eq(skills_auras.SkillID, data.SkillID),
      eq(skills_auras.AuraID, data.ItemID)
    ),
  });
  if (itemIdConflict) errors.SkillID = "Item ID with skill ID already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(skills_auras).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
