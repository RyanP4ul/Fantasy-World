import { hash } from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./../../../../../db/index";
import { users, users_characters, users_characters_houses } from "@/db/schema";
export async function POST(req: Request) {
  try {
    const headers = req.headers;
    const charId = headers.get("ccid");
    const token = headers.get("token");
    const formData = await req.formData();
    const frame = formData.get("frame");

    if (!charId || !token || !frame) {
      return new Response("0", { status: 403 });
    }

    const character = await db.query.users_characters.findFirst({
      columns: { id: true, UserID: true },
      where: eq(users_characters.id, Number(charId)),
    });

    if (!character) {
      return new Response("0", { status: 403 });
    }

    const user = await db.query.users.findFirst({
      where: and(eq(users.id, character.UserID), eq(users.Password, token)),
    });

    if (!user) {
      return new Response("0", { status: 403 });
    }

    if (frame === "*") {
      await db.transaction(async (tx) => {
        await tx
          .delete(users_characters_houses)
          .where(eq(users_characters_houses.CharID, Number(charId)));
      });
      return new Response("cleared");
    }

    const layoutStr = formData.get("layout");
    if (!layoutStr) return new Response("2");

    const layout = JSON.parse(layoutStr as string);

    if (!layout.xi || !Array.isArray(layout.xi)) return new Response("3");

    await db.transaction(async (tx) => {
      for (const xi of layout.xi) {
        const exist = await tx
          .select({ count: sql<number>`count(*)` })
          .from(users_characters_houses)
          .where(
            and(
              eq(users_characters_houses.CharID, Number(charId)),
              eq(users_characters_houses.ItemID, Number(xi.ID))
            )
          );

        if (exist[0].count > 0) {
          await tx
            .update(users_characters_houses)
            .set({ X: Number(xi.x), Y: Number(xi.y) })
            .where(
              and(
                eq(users_characters_houses.CharID, Number(charId)),
                eq(users_characters_houses.ItemID, Number(xi.ID))
              )
            );
        } else {
          await tx.insert(users_characters_houses).values({
            CharID: Number(charId),
            Frame: frame.toString(),
            ItemID: Number(xi.ID),
            X: Number(xi.x),
            Y: Number(xi.y),
          });
        }
      }
    });

    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("0", { status: 500 });
  }
}
