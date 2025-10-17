import { db } from "@/db";
import { panel_logs, users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET() {
  const res = await db.query.panel_logs.findMany({
    orderBy: desc(panel_logs.id),
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

export async function POST(req: Request) {
  const { userId, action, description } = await req.json();

  if (!userId || !action || !description) {
    return Response.json("Missing required fields", { status: 400 });
  }

  try {
    const res = await db.insert(panel_logs).values({
      UserID: Number(userId),
      Action: action,
      Description: description,
    } as any);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Ok", { status: 200 });
  } catch (error) {
    return Response.json("Failed to create", { status: 400 });
  }
}