import { db } from "@/db";
import {
  achievements,
  users,
  users_characters_achievements as char_ach,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type Achievement = {
  id: number;
  Name: string;
  Description: string;
  Image: string;
  ShopID: number;
};

export async function getAchievements() {
  return db.query.achievements.findMany();
}

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
