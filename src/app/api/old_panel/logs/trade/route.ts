import { db } from "@/db";
import { users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  const [res] = await db.execute("SELECT a.* FROM users_trades AS a INNER JOIN users_trades_items AS b ON a.FromUserID = b.FromUserID AND a.ToUserID = b.ToUserID ORDER BY a.id DESC") as any[];

  const usersObj = await db.query.users.findMany({ orderBy: asc(users.id) });

  const modified = await Promise.all(res.map(async (data : any) => {

    const [tradeItems] = await db.execute(`SELECT b.Name, b.Type, b.Equipment FROM users_trades_items AS a LEFT JOIN items AS b ON a.ItemID = b.id WHERE a.FromUserID = ${data.FromUserID} AND a.ToUserID = ${data.ToUserID}`) as any[];

    return {
      ...data,
      From: `${
        usersObj.find((user) => user.id === data.FromUserID)?.Name || "None"
      }`,
      To: `${
        usersObj.find((user) => user.id === data.ToUserID)?.Name || "None"
      }`,
      items: tradeItems
    };
  }));

  return Response.json(await modified);
}
