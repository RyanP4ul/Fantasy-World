import { db } from "@/db";
import { users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  const [res] = await db.execute("SELECT a.*, b.Name AS ItemName FROM users_markets_logs AS a LEFT JOIN items AS b ON a.ItemID = b.id ORDER BY id DESC") as any[];

  const usersObj = await db.query.users.findMany({ orderBy: asc(users.id) });

  const modified = res.map((data : any) => {
    return {
      ...data,
      Owner: `${
        usersObj.find((user) => user.id === data.OwnerID)?.Name || "None"
      }`,
      Buyer: `${
        usersObj.find((user) => user.id === data.BuyerID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}
