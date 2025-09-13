import { db } from "@/db";
import { users, users_items } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
    req: Request,
    context: { params: Promise<{ name: string }> }
) {
    const name = (await context.params)?.name || "";

    const user = await db.query.users.findFirst({
        where: eq(users.Name, name.toLowerCase()),
    });

    if (!user) {
        return Response.json({ errors: { message: "User not found" } }, { status: 404 });
    }

    const [guild] = await db.execute(sql`
        SELECT a.GuildID, a.Rank, b.Name FROM users_guilds AS a
        INNER JOIN guilds AS b ON a.GuildID = b.id WHERE a.UserID = ${user.id}
        LIMIT 1
    `) as any;

    const [userItems] = await db.execute(sql`
        SELECT a.ItemID, a.Equipped, a.Quantity, a.Bank, b.Name, b.Type, b.Rarity, b.Upgrade, b.Coins, b.Trade FROM users_items AS a
        INNER JOIN items AS b ON a.ItemID = b.id WHERE a.UserID = ${user.id}
    `) as any[];

    const userItemEquipped : Record<string, string | {Name: string; Type: string }> = {
        "Sword": "None",     // WEAPON
        "Class": "None",     // CLASS
        "Armor": "None",     // ARMOR
        "Helm" : "None",     // HELM
        "Cape" : "None",     // CAPE
        "Pet" : "None",      // PET
    };

    if (userItems) {
        userItems.forEach((item: any) => {
            if (item.Equipped) {
                userItemEquipped[item.Type as keyof typeof userItemEquipped] = {
                    Name: item.Name,
                    Type: item.Type
                };
            }
        });
    }

    const [userAchievements] = await db.execute(sql`
        SELECT b.Name, b.Image, b.Description FROM users_achievements AS a
        INNER JOIN achievements AS b ON a.AchievementID = b.id WHERE a.UserID = ${user.id}
    `) as any[];

    const [userTitles] = await db.execute(sql`
        SELECT b.Name, b.Description FROM users_titles AS a
        INNER JOIN titles AS b ON a.TitleID = b.id WHERE a.UserID = ${user.id}
    `) as any[];

    return Response.json({
        user,
        guild: guild[0],
        userItems: userItems,
        userItemEquipped: userItemEquipped,
        userAchievements: userAchievements,
        userTitles: userTitles
    });
}