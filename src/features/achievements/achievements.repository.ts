import { db } from "@/db";
import {
  achievements,
  users,
  users_characters_achievements as char_ach,
} from "@/db/schema";
import { desc, eq, SQL, sql } from "drizzle-orm";

export type Achievement = {
  id: number;
  Name: string;
  Description: string;
  Image: string;
  ShopID: number;
};

export async function getAchievements(
  page: number,
  limit: number
): Promise<Achievement[]> {
  return db.query.achievements.findMany(
    page && limit
      ? {
          orderBy: desc(achievements.id),
          limit: limit,
          offset: (page - 1) * limit,
        }
      : undefined
  );
}

export async function getAchievementById(
  id: number,
  columns?: object
): Promise<Achievement | null> {
  const achievement = await db.query.achievements.findFirst({
    columns: columns ? columns : {},
    where: eq(achievements.id, id),
  });

  return achievement || null;
}

export async function getAchievementCount(): Promise<number> {
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(achievements);
  return count;
}

export async function doesAchievementExist(
  where: SQL<unknown>
): Promise<boolean> {
  const achievement = await db.query.achievements.findFirst({
    where,
  });
  return achievement !== undefined;
}

export async function createAchievement(data: any) : Promise<boolean> {
  return await db.transaction(async (tx) => {
    const result = await tx.insert(achievements).values(data);
    return result !== undefined;
  });
}

export async function updateAchievement(
  id: number,
  data: any
): Promise<boolean> {
  return await db.transaction(async (tx) => {
    if (!(await doesAchievementExist(eq(achievements.id, id)))) {
      return false;
    }

    await tx.update(achievements).set(data).where(eq(achievements.id, id));

    return true;
  });
}

export async function deleteAchievement(id: number): Promise<boolean> {
  return await db.transaction(async (tx) => {
    if (!(await doesAchievementExist(eq(achievements.id, id)))) {
      return false;
    }

    await tx.delete(achievements).where(eq(achievements.id, id));

    return true;
  });
}
