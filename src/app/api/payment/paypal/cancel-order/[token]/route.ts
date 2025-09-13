import { eq } from 'drizzle-orm';
import { db } from "@/db";
import { users_stores } from "@/db/schema";

export async function DELETE(
    req: Request, 
    context: { params: Promise<{ token: string }> }
) {
    const token = (await context.params)?.token || "";

    if (!token) {
        return new Response("Token is required", { status: 400 });
    }

    const userStores = await db.query.users_stores.findFirst({
        where: eq(users_stores.Token, token)
    });

    if (!userStores || userStores.Status != "Pending") {
        return new Response("Invalid", { status: 404 });
    }

    try {
        await db.transaction(async (tx) => {
            await tx.update(users_stores).set({ Status: "Canceled" }).where(eq(users_stores.Token, token));
        });

        return new Response("ok");
    } catch (error) {
        return new Response("Error canceling PayPal order", { status: 500 });
    }
}