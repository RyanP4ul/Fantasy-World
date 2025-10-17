import { db } from "@/db";
import { items, items_skills, skills } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { skillSchema } from "@/validations/panel/itemValidator";
import { get } from "http";
import { getEquipmentByType } from "@/lib/utils";

export async function GET() {
  const res = await db.query.items_skills.findMany({
    orderBy: desc(items_skills.id),
  });

  const itemObj = await db.query.items.findMany();
  const skillObj = await db.query.skills.findMany();
  const modified = res.map((itemSkill) => {

    return {
      ...itemSkill,
      ItemName: `${
        itemObj.find((p) => p.id === itemSkill.ItemID)?.Name || "None"
      }`,
      SkillName: `${
        skillObj.find((p) => p.id === itemSkill.SkillID)?.Name || "None"
      }`
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await skillSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.items_skills.findFirst({
    where: eq(items_skills.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

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

  try {
    const res = await db.insert(items_skills).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}
