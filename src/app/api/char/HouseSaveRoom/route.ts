import { db } from "@/db";
import { achievements, users, users_houses } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { achievementSchema } from "@/validations/panel/achievementSchema";
import bcrypt from "bcryptjs";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: number }> }
) {
  try {
    const headers = req.headers;
    const ccid = headers.get("ccid");
    const token = headers.get("token");
    const formData = await req.formData();
    const frame = formData.get("frame");

    if (!ccid || !token || !frame) {
      return Response.json("0", { status: 400 });
    }

    // check user
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(ccid)),
    });

    if (!user || !bcrypt.compareSync(token, user.Hash)) {
      return Response.json("1", { status: 403 });
    }

    const result = await db.transaction(async (trx) => {
      if (frame === "*") {
        await trx.delete(users_houses).where(eq(users_houses.UserID, Number(ccid)));
        return "cleared";
      }

      const layoutStr = formData.get("layout");
      if (!layoutStr) return "2";

      let layout: any;
      try {
        layout = JSON.parse(layoutStr.toString());
      } catch {
        return "3";
      }

      if (!layout.xi || !Array.isArray(layout.xi)) {
        return "3";
      }

      for (const xi of layout.xi) {
        const exist = await trx
          .select({ count: sql<number>`count(*)` })
          .from(users_houses)
          .where(
            and(
              eq(users_houses.UserID, Number(ccid)),
              eq(users_houses.ItemID, Number(xi.ID))
            )
          );

        if (exist[0].count > 0) {
          await trx
            .update(users_houses)
            .set({ X: Number(xi.x), Y: Number(xi.y) })
            .where(
              and(
                eq(users_houses.UserID, Number(ccid)),
                eq(users_houses.ItemID, Number(xi.ID))
              )
            );
        } else {
          await trx.insert(users_houses).values({
            UserID: Number(ccid),
            Frame: frame.toString(),
            ItemID: Number(xi.ID),
            X: Number(xi.x),
            Y: Number(xi.y),
          });
        }
      }

      return "success";
    });

    return new Response(result);
  } catch {
    return Response.json("error", { status: 500 });
  }
}
