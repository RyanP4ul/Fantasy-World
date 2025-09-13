import { enhancements } from "./../../../../db/schema";
import { db } from "@/db";
import { items, monsters, quests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const [rows]: any[] = await db.execute(`
    SELECT 
       (SELECT COUNT(*) FROM auras) AS auras,
       (SELECT COUNT(*) FROM classes) AS classes,
       (SELECT COUNT(*) FROM enhancements) AS enhancements,
       (SELECT COUNT(*) FROM items) AS items,
       (SELECT COUNT(*) FROM maps) AS maps,
       (SELECT COUNT(*) FROM monsters) AS monsters,
       (SELECT COUNT(*) FROM quests) AS quests,
       (SELECT COUNT(*) FROM shops) AS shops,
       (SELECT COUNT(*) FROM users) AS users,
       (SELECT COUNT(*) FROM users WHERE LastLogin = CURRENT_DATE) AS peakPlayerToday,
       (SELECT COUNT(*) FROM users WHERE DateCreated = CURRENT_DATE) AS registeredToday
  `);

  if (!rows || rows.length === 0) {
    return Response.json("Failed to fetch data", { status: 400 });
  }

  const [mostEquippedItems]: any[] = await db.execute(`
    SELECT b.Name AS name, b.Type as type, COUNT(*) as total_equipped
    FROM users_items AS a
    INNER JOIN items AS b ON a.ItemID = b.id
    WHERE a.Equipped = 1
    GROUP BY a.ItemID
    ORDER BY total_equipped DESC
    LIMIT 5
  `);

  const [panel_logs] = await db.execute(`
    SELECT a.*, b.Name as User FROM panel_logs AS a
    LEFT JOIN users AS b ON a.UserID = b.id
    ORDER BY a.id DESC
    LIMIT 5
  `);

  const [worldBosses] = await db.execute(`
    SELECT b.Name,
    CASE
      WHEN NOW() >= DATE_ADD(DeathTime, INTERVAL SpawnInterval * 1000 MICROSECOND) 
        THEN 'Spawned'
      ELSE DATE_ADD(DeathTime, INTERVAL SpawnInterval * 1000 MICROSECOND)
    END AS NextSpawn
    FROM monsters_bosses AS a
    LEFT JOIN monsters AS b ON a.MonsterID = b.id
    ORDER BY a.id DESC
    LIMIT 5
  `);

  return Response.json({
    ...rows[0],
    mostEquippedItems,
    panel_logs,
    worldBosses,
  });
}
