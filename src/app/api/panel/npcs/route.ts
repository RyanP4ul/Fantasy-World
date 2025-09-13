import { db } from "@/db";
import { npcs } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { npcSchema } from "@/validations/panel/npcValidator";

export async function GET() {
  const res = await db.query.npcs.findMany({
    orderBy: desc(npcs.id),
  });

  const modified = res.map((data) => {
    return {
      ...data,
      TextNameColor: String(data.TextNameColor).replace("0x", "#") || "#000000",
      TextGuildColor: String(data.TextGuildColor).replace("0x", "#") || "#000000",
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await npcSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.npcs.findFirst({
    where: eq(npcs.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const nameConflict = await db.query.npcs.findFirst({
    where: eq(npcs.Name, data.Name),
  });
  if (nameConflict) errors.Name = "Name already exists";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  if (data.TextNameColor && data.TextNameColor.startsWith("#")) {
    data.TextNameColor = String(data.TextNameColor).replace("#", "0x");
  }

  if (data.TextGuildColor && data.TextGuildColor.startsWith("#")) {
    data.TextGuildColor = String(data.TextGuildColor).replace("#", "0x");
  }

  try {
    const res = await db.insert(npcs).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}