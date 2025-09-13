import { db } from "@/db";
import { stores, stores_items } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    req: Request
) {
    const _stores = await db.query.stores.findMany({});

    // _stores.map(store => {
    //     store.id
    // });
    // const storesItems = await db.query.stores_items.findMany({});

    return Response.json(_stores);
};