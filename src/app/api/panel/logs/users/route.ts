import { db } from "@/db";
import { users_logs, users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  const res = await db.query.users_logs.findMany({
    orderBy: desc(users_logs.id),
  });

  const usersObj = await db.query.users.findMany({ orderBy: asc(users.id) });

  const modified = res.map((data) => {
    return {
      ...data,
      Username: `${
        usersObj.find((user) => user.id === data.UserID)?.Name || "None"
      }`,
    };
  });

  return Response.json(modified);
}
