import { Store } from 'lucide-react';
import { db } from "@/db";
import { stores, stores_items } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: number }> }
) {
    const id = (await context.params)?.id || 0;

    // const _stores = await db.query.stores.findFirst({
    //     where: eq(stores.id, id)
    // });

    const [store] = await db.execute(`
        SELECT a.*, IFNULL(b.Name, "None") AS Title , IFNULL(c.Name, "None") AS Achievement 
        FROM stores AS a 
        LEFT JOIN titles AS b ON a.TitleID = b.id 
        LEFT JOIN achievements AS c ON a.AchievementID = c.id 
        WHERE a.id = ${id}
        LIMIT 1
    `) as any[];

    if (!store) {
        return Response.json({ error: "Store not found" }, { status: 404 });
    }

    const [storesItems] = await db.execute(`
        SELECT a.Quantity, b.id, b.Name, b.Type, b.Equipment FROM stores_items AS a 
        INNER JOIN items AS b ON a.ItemID = b.id
        WHERE a.StoreID = ${id}
    `);

    return Response.json({ ...store[0], items: storesItems });
};