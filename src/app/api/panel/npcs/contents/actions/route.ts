import { db } from "@/db";
import { npcs_contents, npcs_contents_actions } from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { actionSchema } from "@/validations/panel/npcValidator";

export async function GET() {
  const res = await db.query.npcs_contents_actions.findMany({
    orderBy: desc(npcs_contents_actions.id),
  });

  const contentObj = await db.query.npcs_contents.findMany({ orderBy: asc(npcs_contents.id) });

  const modified = res.map((data) => {
    return {
      ...data,
      Category: `${
        contentObj.find((content) => content.id === data.ContentID)?.Category || "None"
      }`,
      TitleColor: String(data.TitleColor).replace("0x", "#") || "#000000",
      SubTitleColor: String(data.SubTitleColor).replace("0x", "#") || "#000000",
    };
  });

  return Response.json(modified);
}

export async function POST(req: Request) {
  const data = await req.json();
  const errors: Record<string, string> = {};

  if ((await actionSchema.safeParseAsync(data)).success === false)
    return Response.json("Invalid data", { status: 400 });

  const idConflict = await db.query.npcs_contents_actions.findFirst({
    where: eq(npcs_contents_actions.id, data.id),
  });
  if (idConflict) errors.id = "Id already exists";

  const contentExist = await db.query.npcs_contents.findFirst({
    where: eq(npcs_contents.id, data.ContentID),
  });
  if (!contentExist) errors.ContentID = "ContentID does not exist";

  if (Object.keys(errors).length > 0)
    return Response.json({ errors }, { status: 400 });

  if (data.TitleColor && String(data.TitleColor).startsWith("#")) {
    data.TitleColor = String(data.TitleColor).replace("#", "0x");
  }

  if (data.SubTitleColor && String(data.SubTitleColor).startsWith("#")) {
    data.SubTitleColor = String(data.SubTitleColor).replace("#", "0x");
  }

  try {
    const res = await db.insert(npcs_contents_actions).values(data);

    if (!res) return Response.json("Failed to create", { status: 400 });

    return Response.json("Successfully created", { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json("Failed to create " + error, { status: 400 });
  }
}