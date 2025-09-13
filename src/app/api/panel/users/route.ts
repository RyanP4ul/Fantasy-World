import { db } from "@/db";
import { users } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { factionSchema } from "@/validations/panel/factionValidator";
import { getRoles } from "@/lib/utils";

export async function GET() {
  const res = await db.query.users.findMany({
    columns: {  id: true, Name: true, Access: true, Level: true, Country: true, DiscordID: true, DiscordAvatar: true },
    orderBy: desc(users.id),
  });

  const modified = res.map(user => ({
    ...user,
    DiscordID: String(user.DiscordID) || "",
    DiscordAvatar: String(user.DiscordAvatar) || "",
    Roles: getRoles(user.Access),
  }));

  return Response.json(modified);
}