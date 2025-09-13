import { db } from "@/db";
import { achievements, stores, titles } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { storeSchema } from "@/validations/panel/storeSchema";

export async function GET() {
  const res = await db.query.stores.findMany({
    orderBy: desc(stores.id),
  });
  return Response.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await storeSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.stores.findFirst({
    where: eq(stores.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  if (data.TitleID) {
    const titleExist = await db.query.titles.findFirst({
      where: eq(titles.id, data.TitleID),
    });
    if (!titleExist) {
      errors.TitleID = "Title ID does not exist";
    }
  }

  if (data.AchievementID) {
    const achievementExist = await db.query.achievements.findFirst({
      where: eq(achievements.id, data.AchievementID),
    });
    if (!achievementExist) {
      errors.AchievementID = "Achievement ID does not exist";
    }
  }

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  try {
    const res = await db.insert(stores).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
