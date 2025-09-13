import { db } from "@/db";
import { sql } from "drizzle-orm";

const ALLOWED_TABLES = [
    "achievements",
    "auras", "auras_effects", 
    "book", "book_quests",
    "classes",
    "enhancements", "enhancements_patterns",
    "factions",
    "game_menu", "game_menu_news", 
    "items", "items_requirements", "items_skills", 
    "maps", "maps_items", "maps_monsters", "maps_npcs",
    "skills", "skills_assign", "skills_auras",
    "stores", "stores_items",
    "titles", "titles_styles",
    "monsters", "monsters_bosses", "monsters_drops", "monsters_skills",
    "npcs", "npcs_contents", "npcs_contents_actions", "npcs_entity_generic", "npcs_entity_humanoid",
    "quests", "quests_required_items", "quests_requirements", "quests_rewards",
    "redeems",
    "shops", "shops_items", "shops_seasonal",
    "web_posts",
    "wheels"
];

export async function GET(
    req: Request,
    context: { params: Promise<{ table: string }> }
) {
    const tableName = (await context.params)?.table || "";

    if (!ALLOWED_TABLES.includes(tableName)) {
        return Response.json({ errors: { message: "Invalid!" } }, { status: 403 });
    }

    const [rows] = await db.execute<{ Auto_increment: number }>(
        sql`SHOW TABLE STATUS LIKE ${tableName}`
    );
    const row = Array.isArray(rows) ? rows[0] : undefined;

    return Response.json(row?.Auto_increment);
}
