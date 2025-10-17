import { achievements, users_characters_achievements as char_ach } from "@/db/schema";
import { type Achievement } from "../achievements/achievements.repository";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function getCharAchievementById(
  charId: number
): Promise<Achievement[]> {
  const charAchievements = await db
    .select({
      id: achievements.id,
      Name: achievements.Name,
      Description: achievements.Description,
      Image: achievements.Image,
      ShopID: achievements.ShopID,
    })
    .from(char_ach)
    .where(eq(char_ach.CharID, charId ?? -1))
    .innerJoin(achievements, eq(char_ach.AchievementID, achievements.id));

  return charAchievements;
}