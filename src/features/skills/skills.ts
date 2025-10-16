import { db } from "@/db";
import { skills, skills_assign } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSkillsByItemId(itemId: number) {
  return await db
    .select({
        MaxHitTarget: skills.MaxHitTarget,
        Icon: skills.Icon,
        Cooldown: skills.Cooldown,
        Name: skills.Name,
        id: skills.id,
        Animation: skills.Animation,
        Range: skills.Range,
        Damage: skills.Damage,
        Mana: skills.Mana,
        Target: skills.Target,
        Reference: skills.Reference,
        Type: skills.Type,
        Description : skills.Description,
    })
    .from(skills_assign)
    .innerJoin(skills, eq(skills_assign.SkillID, skills.id))
    .where(eq(skills_assign.ItemID, itemId));
}

// SELECT * FROM skills_assign AS a INNER JOIN skills AS b ON a.SkillID = b.id WHERE a.ItemID = :ItemID
