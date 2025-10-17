import { db } from "@/db";
import { achievements as ach } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { achievementSchema } from "@/validations/panel/achievementSchema";
import {
  getAchievements,
  getAchievementCount,
  doesAchievementExist,
  createAchievement,
} from "@/features/achievements/achievements.repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
  const achievements = await getAchievements(page, limit);
  const count = await getAchievementCount();

  return Response.json({
    data: achievements,
    total: count,
    totalPages: Math.ceil(count / limit),
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await achievementSchema.safeParseAsync(data)).success === false) {
    return Response.json("Invalid data", { status: 400 });
  }

  if (await doesAchievementExist(eq(ach.id, data.id))) {
    errors.Name = "id already exists";
  }

  if (await doesAchievementExist(eq(ach.Name, data.Name))) {
    errors.Name = "Name already exists NEW";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    const res = await createAchievement(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}
